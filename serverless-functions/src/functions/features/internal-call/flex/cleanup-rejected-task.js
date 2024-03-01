const { prepareFlexFunction, twilioExecute } = require(Runtime.getFunctions()['common/helpers/function-helper'].path);

const requiredParameters = [{ key: 'taskSid', purpose: 'unique ID of task to clean up' }];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const { taskSid } = event;

    const conferencesResponse = await twilioExecute(context, (client) =>
      client.conferences.list({
        friendlyName: taskSid,
        status: 'in-progress',
        limit: 20,
      }),
    );

    if (!conferencesResponse.success) {
      return callback(null, assets.response('json', {}));
    }

    await Promise.all(
      conferencesResponse.data.map((conference) => {
        return twilioExecute(context, (client) => client.conferences(conference.sid).update({ status: 'completed' }));
      }),
    );

    response.setBody({});
    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
