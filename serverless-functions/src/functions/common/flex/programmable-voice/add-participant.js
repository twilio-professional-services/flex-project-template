const { prepareFlexFunction, extractStandardResponse } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);
const ConferenceOperations = require(Runtime.getFunctions()['common/twilio-wrappers/conference-participant'].path);

const requiredParameters = [
  { key: 'taskSid', purpose: 'unique ID of task to update' },
  { key: 'to', purpose: 'number to add to the conference' },
  { key: 'from', purpose: 'caller ID to use when adding to the conference' },
];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const { taskSid, to, from } = event;

    const result = await ConferenceOperations.addParticipant({
      context,
      taskSid,
      to,
      from,
    });

    response.setStatusCode(result.status);
    response.setBody({ participantsResponse: result.participantsResponse, ...extractStandardResponse(result) });
    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
