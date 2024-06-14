const { prepareFlexFunction, extractStandardResponse, twilioExecute } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);

const requiredParameters = [
  { key: 'taskSid', purpose: 'unique ID of task to update' },
  { key: 'to', purpose: 'number to add to the conference' },
  { key: 'from', purpose: 'caller ID to use when adding to the conference' },
];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const { taskSid, to, from } = event;

    const result = await twilioExecute(context, (client) =>
      client.conferences(taskSid).participants.create({
        to,
        from,
        earlyMedia: true,
        endConferenceOnExit: false,
      }),
    );

    response.setStatusCode(result.status);
    response.setBody({ participantsResponse: result.data, ...extractStandardResponse(result) });
    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
