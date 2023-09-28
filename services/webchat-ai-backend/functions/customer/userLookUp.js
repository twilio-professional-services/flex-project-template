exports.handler = async (context, event, callback) => {
  try {
    const mockedUserBody = {
      id: "1",
      name: "John Doe",
      language: "en-us",
      email: "johndoe@gmail.com",
      address: {
        street: "123 Main Street",
        city: "New York",
        state: "NY",
        postal_code: "10001",
        country: "United States",
      },
      orders: [
        {
          order_number: "ORD001",
          date: "2023-05-15",
          status: "Shipped",
          items: [
            {
              product_id: "001",
              product_name: "Product 1",
              quantity: 2,
              price: 59.99,
            },
            {
              product_id: "002",
              product_name: "Product 2",
              quantity: 1,
              price: 79.99,
            },
          ],
          total: 199.97,
        },
        {
          order_number: "ORD002",
          date: "2023-05-10",
          status: "Delivered",
          items: [
            {
              product_id: "003",
              product_name: "Product 3",
              quantity: 1,
              price: 89.99,
            },
          ],
          total: 89.99,
        },
      ],
    };

    callback(null, mockedUserBody);
  } catch (error) {
    console.log(error);
    callback(null, error);
  }
};
