const TokenValidator = require("twilio-flex-token-validator").functionValidator;
const PhoneNumberOpertions = require(Runtime.getFunctions()[
  "common/twilio-wrappers/phone-numbers"
].path);

exports.handler = TokenValidator(async function listPhoneNumbers(
  context,
  event,
  callback
) {
  const scriptName = arguments.callee.name;
  const response = new Twilio.Response();

  response.appendHeader("Access-Control-Allow-Origin", "*");
  response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST");
  response.appendHeader("Content-Type", "application/json");
  response.appendHeader("Access-Control-Allow-Headers", "Content-Type");

  try {
    const result = await PhoneNumberOpertions.listPhoneNumbers({
      scriptName,
      context,
      attempts: 0,
    });

    const { success, phoneNumbers: fullPhoneNumberList, status } = result;
    const phoneNumbers = fullPhoneNumberList
      ? fullPhoneNumberList.map((number) => {
          const { friendlyName, phoneNumber } = number;
          return { friendlyName, phoneNumber };
        })
      : null;

    response.setStatusCode(status);
    response.setBody({ success, phoneNumbers });
    callback(null, response);
  } catch (error) {
    console.error(`Unexpected error occurred in ${scriptName}: ${error}`);
    response.setStatusCode(500);
    response.setBody({
      success: false,
      message: error,
    });
    callback(null, response);
  }
});
