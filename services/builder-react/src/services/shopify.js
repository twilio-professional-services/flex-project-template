import Client from 'shopify-buy';
import { shopifyApiToken, storeDomain } from '../config';
import { LocalStorage } from './localStorage';
import LocaleCurrency from 'locale-currency';

/**
 * @param {string} language ex.: en-US, es-MX, th, zh-CN
 */
export const buildShopifyClient = (language) =>
	Client.buildClient({
		domain: storeDomain,
		storefrontAccessToken: shopifyApiToken,
		language: language === 'zn' ? 'zn-CH' : language,
	});

/**
 * @param {ShopifyClient} ShopifyClient
 * @param {{ id?: string; handle?: string }} options
 */
export async function getProduct(ShopifyClient, options) {
	const client = ShopifyClient;
	if (options.handle) {
		return fastClone(await client.product.fetchByHandle(options.handle));
	}
	if (!options.id) {
		throw new Error('A product ID or handle is required');
	}
	return fastClone(await client.product.fetch(options.id));
}

/**
 * @param {ShopifyClient} ShopifyClient - Can be obtained from buildShopifyClient method
 * @param {{ id?: string; handle?: string }} options
 */
export async function getCollection(ShopifyClient, options) {
	const client = ShopifyClient;
	if (options.handle) {
		return fastClone(await client.collection.fetchByHandle(options.handle));
	}
	if (!options.id) {
		throw new Error('A collection ID or handle is required');
	}
	return fastClone(await client.collection.fetch(options.id));
}

/**
 *
 * @param ShopifyClient
 * @returns {Promise<any>}
 */
export async function getCart(ShopifyClient) {
	let currentCart = LocalStorage.getCachedCheckoutId()
    ? await ShopifyClient.checkout.fetch(LocalStorage.getCachedCheckoutId())
    : null;

	if (!currentCart || !!(Date.parse(currentCart?.completedAt)) && Date.parse(currentCart?.completedAt) < Date.now())
		currentCart = await ShopifyClient.checkout.create();

	LocalStorage.setCachedCheckoutId(currentCart.id);

	return fastClone(currentCart);
}

/**
 * @param {ShopifyClient} ShopifyClient
 * @param {LineItemPatch[]} items
 */
export async function addItemsToCart(ShopifyClient, items) {
	const cachedCheckoutId = LocalStorage.getCachedCheckoutId();
	if (cachedCheckoutId === null || ShopifyClient === null)
		throw new Error('Called addItemsToCart too soon');

	if (items?.length < 1)
		throw new Error(
			'Must include at least one line item, empty line items found',
		);

	items.forEach((item) => {
		if (item.variantId == null) throw new Error(`Missing variantId in item`);

		if (item.quantity == null)
			throw new Error(
				`Missing quantity in item with variant id: ${item.variantId}`,
			);
		else if (typeof item.quantity != 'number')
			throw new Error(
				`Quantity is not a number in item with variant id: ${item.variantId}`,
			);
		else if (item.quantity < 1)
			throw new Error(
				`Quantity must not be less than one in item with variant id: ${item.variantId}`,
			);
	});

	return ShopifyClient.checkout.addLineItems(cachedCheckoutId, items);
}

/**
 *
 * @param {ShopifyClient} ShopifyClient,
 * @param {string} variantId
 * @param {number} quantity
 */
export async function addItemToCart(ShopifyClient, variantId, quantity) {
	// FIX ME guarantee that the cart is created before adding to it,
	// this is the ugly way I found to make it work
	await getCart(ShopifyClient);
	const item = [{ variantId, quantity }];

	return addItemsToCart(ShopifyClient, item);
}

export async function updateItemQuantity(
	ShopifyClient,
	cartId,
	lineItemId,
	quantity,
) {
	return ShopifyClient.checkout.updateLineItems(cartId, [
		{ id: lineItemId, quantity },
	]);
}

export function formatCurrency(locale, amount) {
	locale = locale === 'zh' ? 'zh-CN' : locale;
	const priceFormatter = new Intl.NumberFormat(locale, {
		style: 'currency',
		currency: LocaleCurrency.getCurrency(locale),
	});
	return priceFormatter.format(amount);
}

const fastClone = (obj) => JSON.parse(JSON.stringify(obj));
