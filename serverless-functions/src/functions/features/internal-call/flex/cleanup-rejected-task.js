const { prepareFlexFunction } = require(Runtime.getFunctions()['common/helpers/prepare-function'].path);
const ConferenceOperations = require(Runtime.getFunctions()['common/twilio-wrappers/conference-participant'].path);

const requiredParameters = [{ key: 'taskSid', purpose: 'unique ID of task to clean up' }];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const { taskSid } = event;

    const conferencesResponse = await ConferenceOperations.fetchByTask({
      context,
      taskSid,
      status: 'in-progress',
      limit: 20,
      attempts: 0,
    });

    if (!conferencesResponse.success) {
      return callback(null, assets.response('json', {}));
    }

    await Promise.all(
      conferencesResponse.conferences.map((conference) => {
        return ConferenceOperations.updateConference({
          context,
          conference: conference.sid,
          updateParams: { status: 'completed' },
          attempts: 0,
        });
      }),
    );

    response.setBody({});
    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
