const { prepareFlexFunction, extractStandardResponse, twilioExecute } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);

const requiredParameters = [
  { key: 'conferenceSid', purpose: 'conference sid to target for changes' },
  {
    key: 'participantSid',
    purpose: 'participant sid to target for conference changes',
  },
  {
    key: 'muted',
    purpose: 'boolean to determine the muted status of the participant in the conference',
  },
  {
    key: 'coaching',
    purpose: 'boolean to determine the coaching status of the participant in the conference',
  },
];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const { conferenceSid, participantSid, agentSid, muted, coaching } = event;

    // If agentSid isn't null/blank, we know we are updating the conference coaching status
    if (agentSid && agentSid !== '') {
      const result = await twilioExecute(context, (client) =>
        client.conferences(conferenceSid).participants(participantSid).update({
          coaching,
          callSidToCoach: agentSid,
          muted,
        }),
      );
      response.setStatusCode(result.status);
      response.setBody({
        ...extractStandardResponse(result),
      });
    }
    // If the agentSid is null/blank, we know we are updating the conference muted status
    if (agentSid === '') {
      const result = await twilioExecute(context, (client) =>
        client.conferences(conferenceSid).participants(participantSid).update({
          muted,
        }),
      );

      response.setStatusCode(result.status);
      response.setBody({
        ...extractStandardResponse(result),
      });
    }
    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
