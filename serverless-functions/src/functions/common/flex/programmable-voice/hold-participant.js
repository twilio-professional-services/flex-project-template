const { prepareFlexFunction, extractStandardResponse, twilioExecute } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);

const requiredParameters = [
  { key: 'conference', purpose: 'unique ID of conference to update' },
  { key: 'participant', purpose: 'unique ID of participant to update' },
  { key: 'hold', purpose: 'whether to hold or unhold the participant' },
];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const { conference, participant, hold, holdUrl } = event;

    const updateOpts = {
      hold: hold === 'true',
    };

    if (updateOpts.hold && Boolean(holdUrl)) {
      updateOpts.holdUrl = holdUrl;
    }

    const result = await twilioExecute(context, (client) =>
      client.conferences(conference).participants(participant).update(updateOpts),
    );

    const { data: participantsResponse, status } = result;

    response.setStatusCode(status);
    response.setBody({ participantsResponse, ...extractStandardResponse(result) });
    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
