exports.handler = function(context, event, callback) {
    const response = new Twilio.Response();

    response.setStatusCode(200);
    response.appendHeader("Content-Type", "application/json");
    response.setBody({ success: true, message: "Monitor stub executed" });

    callback(null, response);
};
