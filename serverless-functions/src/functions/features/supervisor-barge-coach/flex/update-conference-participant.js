exports.handler = async function (context, event, callback) {

  const object = {hello: "Hello World 3"} 

  callback(null, object);

};