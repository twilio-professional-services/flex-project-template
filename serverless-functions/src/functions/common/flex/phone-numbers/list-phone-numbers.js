const { prepareFlexFunction, extractStandardResponse } = require(Runtime.getFunctions()['common/helpers/function-helper'].path);
const PhoneNumberOperations = require(Runtime.getFunctions()['common/twilio-wrappers/phone-numbers'].path);
const VoiceOperations = require(Runtime.getFunctions()['common/twilio-wrappers/programmable-voice'].path);

const requiredParameters = [];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const fetchOutgoingCallerIds = event.IncludeOutgoing === 'true' || false;

    const result = await PhoneNumberOperations.listPhoneNumbers({
      context,
    });

    const { phoneNumbers: fullPhoneNumberList } = result;
    let phoneNumbers = fullPhoneNumberList
      ? fullPhoneNumberList.map(({ friendlyName, phoneNumber }) => ({ friendlyName, phoneNumber }))
      : [];

    if (fetchOutgoingCallerIds) {
      const outgoingResult = await VoiceOperations.listOutgoingCallerIds({
        context,
      });

      if (outgoingResult?.success) {
        const { callerIds } = outgoingResult;
        phoneNumbers = phoneNumbers.concat(
          callerIds.map(({ friendlyName, phoneNumber }) => ({ friendlyName, phoneNumber })),
        );
      }
    }

    // Sort phoneNumbers alphabetically by friendlyName
    phoneNumbers.sort((a, b) => a.friendlyName.localeCompare(b.friendlyName));

    response.setStatusCode(result.status);
    response.setBody({ phoneNumbers, ...extractStandardResponse(result) });
    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
