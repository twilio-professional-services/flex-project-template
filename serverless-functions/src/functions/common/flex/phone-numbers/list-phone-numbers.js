const { prepareFlexFunction, extractStandardResponse } = require(Runtime.getFunctions()['common/helpers/function-helper'].path);
const PhoneNumberOperations = require(Runtime.getFunctions()['common/twilio-wrappers/phone-numbers'].path);
const VoiceOperations = require(Runtime.getFunctions()['common/twilio-wrappers/programmable-voice'].path);

const requiredParameters = [];

// Define a list of phone numbers to exclude
const excludeNumbers = [
  '+12124666904', // MEC Fax
  '+18668508068', // CSAT
  '+19175124846', // Flight Fax
  '+19298102512', // Spare
  '+18777482095', // MEC Toll Free
  '+19293846357', // Test Practice
  '+18668606534', // Flight APP 2FA
  '+13322089598', // Spare
  '+15162003926', // Maywell Initial Number
  '+16464553199' // Lexmed Secondary
]; // Add the numbers you want to exclude

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const fetchOutgoingCallerIds = event.IncludeOutgoing === 'true' || false;

    const result = await PhoneNumberOperations.listPhoneNumbers({
      context,
    });

    const { phoneNumbers: fullPhoneNumberList } = result;
    let phoneNumbers = fullPhoneNumberList
      ? fullPhoneNumberList
        .map(({ friendlyName, phoneNumber }) => ({ friendlyName, phoneNumber }))
        .filter(({ phoneNumber }) => !excludeNumbers.includes(phoneNumber)) // Filter out excluded numbers
      : [];

    if (fetchOutgoingCallerIds) {
      const outgoingResult = await VoiceOperations.listOutgoingCallerIds({
        context,
      });

      if (outgoingResult?.success) {
        const { callerIds } = outgoingResult;
        const filteredCallerIds = callerIds
          .map(({ friendlyName, phoneNumber }) => ({ friendlyName, phoneNumber }))
          .filter(({ phoneNumber }) => !excludeNumbers.includes(phoneNumber)); // Filter out excluded numbers

        phoneNumbers = phoneNumbers.concat(filteredCallerIds);
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
