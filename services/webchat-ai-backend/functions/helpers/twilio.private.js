class TwilioHelper {
  defaultResponse() {
    const response = this._defaultResponse();
    return response;
  }

  badRequestResponse(message) {
    const response = this._defaultResponse();
    response.setStatusCode(401);
    response.setBody(message);
    return response;
  }

  internalServerError(message) {
    const response = this._defaultResponse();
    response.setStatusCode(500);
    response.setBody({ error: message });
    return response;
  }

  forbiddenResponse() {
    const response = this._defaultResponse();
    response.setStatusCode(403);
    return response;
  }

  _defaultResponse() {
    const response = new Twilio.Response(); //eslint-disable-line no-undef
    response.appendHeader("Access-Control-Allow-Origin", "*");
    response.appendHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
    response.appendHeader("Content-Type", "application/json");
    return response;
  }

  handleError(message, error) {
    console.error(message, error.message);
    throw new Error(`${message}: ${error.message}`);
  }

  createClient(context) {
    return context.getTwilioClient();
  }
}

/** @module twilioHelper */
module.exports = {
  TwilioHelper,
};
