const { prepareFlexFunction, extractStandardResponse, twilioExecute } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);

const requiredParameters = [];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const fetchOutgoingCallerIds = event.IncludeOutgoing === 'true' || false;

    const result = await twilioExecute(context, (client) => client.incomingPhoneNumbers.list());

    const { data: fullPhoneNumberList } = result;
    let phoneNumbers = fullPhoneNumberList
      ? fullPhoneNumberList.map((number) => {
          const { friendlyName, phoneNumber } = number;
          return { friendlyName, phoneNumber };
        })
      : null;

    if (fetchOutgoingCallerIds) {
      const outgoingResult = await twilioExecute(context, (client) => client.outgoingCallerIds.list());

      if (outgoingResult?.success) {
        const { data: callerIds } = outgoingResult;
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
