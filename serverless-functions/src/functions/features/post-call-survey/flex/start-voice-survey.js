const { prepareFlexFunction, twilioExecute } = require(Runtime.getFunctions()['common/helpers/function-helper'].path);

const requiredParameters = [
  { key: 'queueName', purpose: 'The Queue that handled the call' },
  { key: 'callSid', purpose: 'The CallSID that will be surveyed' },
  { key: 'taskSid', purpose: 'The TaskSID that the Agent handled' },
  { key: 'surveyKey', purpose: 'The survey to play' },
  { key: 'Token', purpose: 'Flex Token' },
];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    console.log('start-voice-survey');
    const { queueName, callSid, taskSid, surveyKey } = event;

    const url = `https://${context.DOMAIN_NAME}/features/post-call-survey/common/survey-questions?queueName=${queueName}&callSid=${callSid}&taskSid=${taskSid}&surveyKey=${surveyKey}&questionIndex=0`;
    console.log(url);

    const params = {
      method: 'POST',
      url: encodeURI(url),
    };

    // UPDATE: Rethink serverless wrappers #492
    const result = await twilioExecute(context, async (client) => {
      return client.calls(callSid).update(params);
    });

    if (result.success) {
      console.log('Twilio Update Call API response:', result.data);
    }

    console.log('result:', result);
    const { status } = result;
    response.setStatusCode(status);

    return callback(null, response);
  } catch (error) {
    console.log(error);
    return handleError(error);
  }
});
