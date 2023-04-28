const { prepareFlexFunction, extractStandardResponse } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);
const ConferenceOperations = require(Runtime.getFunctions()['common/twilio-wrappers/conference-participant'].path);

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
      const result = await ConferenceOperations.coachToggle({
        context,
        conferenceSid,
        participantSid,
        agentSid,
        muted,
        coaching,
      });
      response.setStatusCode(result.status);
      response.setBody({
        conference: result.conferenceSid,
        ...extractStandardResponse(result),
      });
    }
    // If the agentSid is null/blank, we know we are updating the conference muted status
    if (agentSid === '') {
      const result = await ConferenceOperations.bargeToggle({
        context,
        conferenceSid,
        participantSid,
        muted,
      });

      const { status, conferenceSid: conference } = result;
      response.setStatusCode(status);
      response.setBody({
        conference,
        ...extractStandardResponse(result),
      });
    }
    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
