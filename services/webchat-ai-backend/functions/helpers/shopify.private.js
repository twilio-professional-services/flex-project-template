const fetch = require("isomorphic-fetch");
const Shopify = require("shopify-api-node");
const Client = require("shopify-buy");
const { Client: GQLClient, fetchExchange } = require("@urql/core");
const { flatten } = require("lodash");

global.fetch = fetch;

const FLEX_STATUS = {
  CONFIRMED: "CONFIRMED",
  DELIVERED: "DELIVERED",
  REFUNDED: "REFUNDED",
  RETURNED: "RETURNED",
  RETURNING: "RETURNING",
  SHIPPED: "SHIPPED",
};

class ShopifyClient {
  constructor(context) {
    this.client = Client.buildClient({
      domain: `${context.SHOPIFY_STORE_DOMAIN}.myshopify.com`,
      storefrontAccessToken: context.SHOPIFY_STOREFRONT_API_TOKEN,
    });

    this.shopifyRest = this.buildShopifyRestClient(
      `${context.SHOPIFY_STORE_DOMAIN}.myshopify.com`,
      context.SHOPIFY_ADMIN_API_TOKEN
    );

    this.shopifyGQL = this.buildShopifyGQLClient(
      context.SHOPIFY_STORE_DOMAIN,
      context.SHOPIFY_ADMIN_API_TOKEN
    );
  }

  buildShopifyRestClient(shopURL, accessToken) {
    console.log({
      shopName: shopURL,
      accessToken,
    });

    return new Shopify({
      shopName: shopURL,
      accessToken,
    });
  }

  buildShopifyGQLClient(shopURL, accessToken) {
    return new GQLClient({
      fetch,
      url: `https://${shopURL}.myshopify.com/admin/api/2023-07/graphql.json`, // open this on POSTMAN and have fun with query and mutation autocomplete
      exchanges: [fetchExchange],
      fetchOptions: () => {
        return {
          headers: { "X-Shopify-Access-Token": accessToken },
        };
      },
    });
  }

  async fetchProducts() {
    try {
      return await this.client.product.fetchAll();
    } catch (error) {
      console.log(error.message || "Error fetching Shopify products");
    }
  }

  async shipOrder(orderId) {
    const trackingData = {
      notify_customer: true,
      tracking_info: {
        number: "777",
        url: "https://home.tdpdev.link",
        company: "TDP Shipping",
      },
    };
    const [fulfillment] = await this.shopifyRest.fulfillment.list(orderId);
    await this.shopifyRest.fulfillment.updateTracking(
      fulfillment.id,
      trackingData
    );
    await this.shopifyRest.fulfillmentEvent.create(orderId, fulfillment.id, {
      status: "in_transit",
    });
  }

  async deliverOrder(orderId) {
    const [fulfillment] = await this.shopifyRest.fulfillment.list(orderId);
    await this.shopifyRest.fulfillmentEvent.create(orderId, fulfillment.id, {
      status: "delivered",
    });
  }

  async returnOrder(orderId) {
    const order = await this.getGqlOrder(orderId);

    return this.shopifyGQL.mutation(this.gqlMutationReturnOrder, {
      returnInput: {
        notifyCustomer: true,
        orderId: `gid://shopify/Order/${orderId}`,
        requestedAt: new Date().toISOString(),
        returnLineItems: flatten(
          order.order.fulfillments.map((ff) =>
            ff.fulfillmentLineItems.edges.map(({ node }) => ({
              fulfillmentLineItemId: node.id,
              quantity: node.quantity,
              returnReason: "UNKNOWN",
            }))
          )
        ),
      },
    });
  }

  async refundOrder(orderId) {
    const order = await this.shopifyRest.order.get(orderId);
    const [fulfillment] = await this.shopifyRest.fulfillment.list(orderId);

    const refund_line_items = fulfillment.line_items.map(
      ({ id, quantity, location_id }) => ({
        line_item_id: id,
        quantity,
      })
    );

    const refundCalculation = await this.shopifyRest.refund.calculate(orderId, {
      shipping: {
        full_refund: true,
      },
      refund_line_items,
      currency: order.currency,
    });

    refundCalculation.refund_line_items =
      refundCalculation.refund_line_items.map((rli) => ({
        ...rli,
        restock_type: "return", // return will add products back to store inventory
        location_id: fulfillment.location_id,
      }));
    refundCalculation.transactions = refundCalculation.transactions.map(
      (rt) => ({ ...rt, kind: "refund" })
    );

    console.log(refundCalculation);

    return this.shopifyRest.refund.create(orderId, refundCalculation);
  }

  async collectReturn(orderId) {
    const order = await this.getGqlOrder(orderId);

    const [returnToClose] = order.order.returns.edges.map((e) => e.node);

    return this.shopifyGQL
      .mutation(this.gqlMutationReturnClose, returnToClose)
      .toPromise();
  }

  async fetchCustomer(query) {
    return this.shopifyRest.customer.search(query);
  }

  async fetchOrders(email) {
    try {
      const [customer] = await this.fetchCustomer({ query: `email:${email}` });

      if (!customer) return [];

      return await this.shopifyRest.customer.orders(customer.id);
    } catch (error) {
      console.error(error.message);
      throw new Error(error.message || "Error fetching customer orders");
    }
  }

  async normalizeOrders(orders) {
    try {
      return orders.map((order) => {
        return {
          order_number: order.order_number,
          totalValue: `${order.currency} ${order.current_subtotal_price}`,
          status: order.flexStatus,
          items: order.line_items.map((item) => {
            return {
              product_id: item.product_id,
              name: item.title,
            };
          }),
        };
      });
    } catch (error) {
      console.error(error.message);
      throw new Error(error.message || "Error normalizing customer orders");
    }
  }

  async addOrderFlexStatus(order) {
    // inferring order status based on order object properties
    const flexStatus = [];
    if (order.financial_status.toLowerCase() === "refunded")
      flexStatus.push(FLEX_STATUS.REFUNDED);
    if (order.fulfillments[0]?.shipment_status === "delivered") {
      flexStatus.push(FLEX_STATUS.DELIVERED);
      flexStatus.push(FLEX_STATUS.SHIPPED);
    }

    // RETURN API is not on REST API yet :(
    // this is going to run slow as hell
    const gqlOrder = await this.getGqlOrder(order.id);
    const returnStatus = gqlOrder.order.returns.edges[0]?.node?.status;
    console.log({ returnStatus });

    if (returnStatus && returnStatus.toLowerCase() === "open") {
      flexStatus.push(FLEX_STATUS.RETURNING);
    }

    if (returnStatus && returnStatus.toLowerCase() === "closed") {
      flexStatus.push(FLEX_STATUS.RETURNED);
    }
    if (order.fulfillments[0]?.shipment_status === "in_transit")
      flexStatus.push(FLEX_STATUS.SHIPPED);

    // FIXME: order is always confirmed since shopify has automatic order fulfillments enabled
    // refactor this if orders are turned of and add some pre-confirmation step
    flexStatus.push(FLEX_STATUS.CONFIRMED);
    return { ...order, flexStatus };
  }

  get gqlMutationReturnOrder() {
    return `mutation returnCreate($returnInput: ReturnInput!) {
			returnCreate(returnInput: $returnInput) {
				return {
					id
				}
				userErrors {
					field
					message
				}
			}
		}`;
  }

  async getGqlOrder(orderId) {
    const { data: order, error } = await this.shopifyGQL
      .query(this.gqlQueryOrderById, { id: `gid://shopify/Order/${orderId}` })
      .toPromise();

    if (!!error) throw Error(error);

    return order;
  }

  get gqlQueryOrderById() {
    return `
			query getOrderByID($id: ID!) {
				order(id: $id) {
					id
					name
					fulfillments(first: 1) {
							fulfillmentLineItems(first: 10) {
									edges {
											node {
													id,
													quantity,
											}
									}
							}
					}
					returns (first:1) {
					  edges {
						  node {
							  id
							  status
						  }
					  }
				  }
				}
			}`;
  }

  get gqlMutationReturnClose() {
    return `
			mutation returnClose($id: ID!) {
				returnClose(id: $id) {
					return {
						id
					}
					userErrors {
						field
						message
					}
				}
			}
		`;
  }
}

module.exports = { ShopifyClient };
