exports.handler = async function(context, event, callback) {
    console.log("Barge request received:", event);

    const response = new Twilio.Response();
    response.setStatusCode(200);
    response.appendHeader("Content-Type", "application/json");
    response.setBody({ success: true, message: "Barge stub executed" });

    callback(null, response);
};
