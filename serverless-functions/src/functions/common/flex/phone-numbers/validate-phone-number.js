const { prepareFlexFunction, extractStandardResponse } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);
const LookupOperations = require(Runtime.getFunctions()['common/twilio-wrappers/lookup'].path);

const requiredParameters = [{ key: 'phoneNumber', purpose: 'phone number to validate' }];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  const { phoneNumber } = event;

  try {
    const result = await LookupOperations.validatePhoneNumber({
      context,
      phoneNumber,
    });

    const { lookupResponse, status } = result;

    response.setStatusCode(status);
    response.setBody({ lookupResponse, ...extractStandardResponse(result) });
    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
