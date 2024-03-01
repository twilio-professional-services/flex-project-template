const { prepareFlexFunction, extractStandardResponse, twilioExecute } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);

const requiredParameters = [
  { key: 'conferenceSid', purpose: 'unique ID of conference to resume recording' },
  { key: 'recordingSid', purpose: 'unique ID of recording to resume' },
];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const { conferenceSid, recordingSid } = event;

    const result = await twilioExecute(context, (client) =>
      client.conferences(conferenceSid).recordings(recordingSid).update({
        status: 'in-progress',
      }),
    );

    const { data: recording, status } = result;

    response.setStatusCode(status);
    response.setBody({ recording, ...extractStandardResponse(result) });
    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
