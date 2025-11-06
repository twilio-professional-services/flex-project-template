const { prepareFlexFunction, extractStandardResponse, twilioExecute } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);

const requiredParameters = [{ key: 'callSid', purpose: 'unique ID of call to fetch' }];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const { callSid } = event;

    const result = await twilioExecute(context, (client) => client.calls(callSid).fetch());

    const { data: callProperties, status } = result;

    response.setStatusCode(status);
    response.setBody({ callProperties, ...extractStandardResponse(result) });
    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
