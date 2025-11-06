const { prepareFlexFunction, extractStandardResponse, twilioExecute } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);

const requiredParameters = [
  { key: 'conference', purpose: 'unique ID of conference to update' },
  { key: 'participant', purpose: 'unique ID of participant to update' },
  {
    key: 'muted',
    purpose: 'whether the participant is muted or not',
  },
];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const { conference, participant, muted } = event;

    const result = await twilioExecute(context, (client) =>
      client
        .conferences(conference)
        .participants(participant)
        .update({
          muted: muted === 'true',
        }),
    );

    const { data: participantsResponse, status } = result;

    response.setStatusCode(status);
    response.setBody({ participantsResponse, ...extractStandardResponse(result) });
    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
