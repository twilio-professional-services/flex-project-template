const { prepareFlexFunction, extractStandardResponse, twilioExecute } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);

const requiredParameters = [{ key: 'phoneNumber', purpose: 'phone number to validate' }];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  const { phoneNumber } = event;

  try {
    const result = await twilioExecute(context, (client) => client.lookups.v2.phoneNumbers(phoneNumber).fetch());

    const { data: lookupResponse, status } = result;

    response.setStatusCode(status);
    response.setBody({ lookupResponse, ...extractStandardResponse(result) });
    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
