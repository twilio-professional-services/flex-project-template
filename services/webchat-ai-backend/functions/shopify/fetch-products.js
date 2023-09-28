const Helpers = require(Runtime.getFunctions()["helpers/index"].path);

exports.handler = async (context, event, callback) => {
  const helpers = new Helpers(context, event);

  try {
    const products = await helpers.shopify.fetchProducts();

    callback(null, extractProductData(products));
  } catch (error) {
    console.log(error);
    callback(null, error);
  }
};

function extractProductData(products) {
  return products.map((product) => {
    const { title, description, variants } = product;
    const price = variants[0].price.amount;
    const colors = variants.map((variant) => variant.title);
    const stock = variants.reduce(
      (total, variant) => total + (variant.available ? 1 : 0),
      0
    );

    return {
      title,
      // description,
      price,
      colors,
      stock,
    };
  });
}
