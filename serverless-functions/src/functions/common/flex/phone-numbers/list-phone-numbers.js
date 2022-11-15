const { prepareFlexFunction } = require(Runtime.getFunctions()["common/helpers/prepare-function"].path);
const PhoneNumberOpertions = require(Runtime.getFunctions()[
  "common/twilio-wrappers/phone-numbers"
].path);

const requiredParameters = [];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const result = await PhoneNumberOpertions.listPhoneNumbers({
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
    handleError(error);
  }
});