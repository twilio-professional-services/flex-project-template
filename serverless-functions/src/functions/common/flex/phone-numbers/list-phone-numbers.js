const { prepareFlexFunction, extractStandardResponse } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);
const PhoneNumberOpertions = require(Runtime.getFunctions()['common/twilio-wrappers/phone-numbers'].path);

const requiredParameters = [];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const result = await PhoneNumberOpertions.listPhoneNumbers({
      context,
    });

    const { phoneNumbers: fullPhoneNumberList } = result;
    const phoneNumbers = fullPhoneNumberList
      ? fullPhoneNumberList.map((number) => {
          const { friendlyName, phoneNumber } = number;
          return { friendlyName, phoneNumber };
        })
      : null;

    response.setStatusCode(result.status);
    response.setBody({ phoneNumbers, ...extractStandardResponse(result) });
    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
