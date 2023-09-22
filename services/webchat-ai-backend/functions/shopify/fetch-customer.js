const Helpers = require(Runtime.getFunctions()["helpers/index"].path);

exports.handler = async function(context, event, callback) {
	try {
		const { shopify } = new Helpers(context, event);
		const { email } = event;
		const query = { query: `email:${email}` };

		callback(null, await shopify.fetchCustomer(query));
	} catch (err) {
		callback(err);
	}
};
