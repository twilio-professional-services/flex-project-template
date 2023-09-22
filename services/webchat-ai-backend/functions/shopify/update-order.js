const Helpers = require(Runtime.getFunctions()["helpers/index"].path);

exports.handler = async function(context, event, callback) {
	try {
		const { shopify } = new Helpers(context, event);
		const { orderId, action } = event;

		let result = null;

		switch (action.toLowerCase()) {
			case 'SHIP'.toLowerCase():
				result = await shopify.shipOrder(orderId);
				break;
			case 'DELIVER'.toLowerCase():
				result = await shopify.deliverOrder(orderId);
				break;
			case 'RETURN'.toLowerCase():
				result = await shopify.returnOrder(orderId);
				break;
			case 'COLLECT_RETURN'.toLowerCase():
				result = await shopify.collectReturn(orderId);
				break;
			case 'REFUND'.toLowerCase():
				result = await shopify.refundOrder(orderId);
				break;
			default:
				throw Error('Invalid action: choose SHIP, DELIVER, RETURN, COLLECT_RETURN, REFUND');
		}

		callback(null, result);
	} catch (err) {
		callback(err);
	}
};
