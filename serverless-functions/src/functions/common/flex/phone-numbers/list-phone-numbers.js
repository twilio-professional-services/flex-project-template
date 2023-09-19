const { prepareFlexFunction, extractStandardResponse } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);
const PhoneNumberOpertions = require(Runtime.getFunctions()['common/twilio-wrappers/phone-numbers'].path);
const VoiceOpertions = require(Runtime.getFunctions()['common/twilio-wrappers/programmable-voice'].path);

const requiredParameters = [];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const fetchOutgoingCallerIds = event.IncludeOutgoing === 'true' || false;

    const result = await PhoneNumberOpertions.listPhoneNumbers({
      context,
    });

    const { phoneNumbers: fullPhoneNumberList } = result;
    let phoneNumbers = fullPhoneNumberList
      ? fullPhoneNumberList.map((number) => {
          const { friendlyName, phoneNumber } = number;
          return { friendlyName, phoneNumber };
        })
      : null;

    if (fetchOutgoingCallerIds) {
      const outgoingResult = await VoiceOpertions.listOutgoingCallerIds({
        context,
      });

      if (outgoingResult?.success) {
        const { callerIds } = outgoingResult;
        phoneNumbers = phoneNumbers.concat(
          callerIds.map((number) => {
            const { friendlyName, phoneNumber } = number;
            return { friendlyName, phoneNumber };
          }),
        );
      }
    }

    response.setStatusCode(result.status);
    response.setBody({ phoneNumbers, ...extractStandardResponse(result) });
    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
