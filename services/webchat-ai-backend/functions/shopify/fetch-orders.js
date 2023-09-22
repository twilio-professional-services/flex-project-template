const Helpers = require(Runtime.getFunctions()["helpers/index"].path);

exports.handler = async function (context, event, callback) {
  const helpers = new Helpers(context, event);
  try {
    const { email } = event;
    let orders = await helpers.shopify.fetchOrders(email);
    orders = await Promise.all(
      orders.map(async (o) => await helpers.shopify.addOrderFlexStatus(o))
    );

    callback(null, await helpers.shopify.normalizeOrders(orders));
  } catch (err) {
    console.log(err);
    const errorResponse = helpers.twilio.internalServerError(err.message);
    callback(null, errorResponse);
  }
};
