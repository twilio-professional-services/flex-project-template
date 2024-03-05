const {
  prepareFlexFunction,
  extractStandardResponse,
} = require(Runtime.getFunctions()['common/helpers/function-helper'].path);

const VoiceOperations = require(Runtime.getFunctions()[
  'common/twilio-wrappers/programmable-voice'
].path);

const requiredParameters = [
  { key: 'queueName', purpose: 'The Queue that handled the call' },
  { key: 'callSid', purpose: 'The CallSID that will be surveyed' },
  { key: 'taskSid', purpose: 'The TaskSID that the Agent handled' },
  { key: 'surveyKey', purpose: 'The survey to play' },
  { key: 'Token', purpose: 'Flex Token' },
];

exports.handler = prepareFlexFunction(
  requiredParameters,
  async (context, event, callback, response, handleError) => {
    try {
      console.log('start-voice-survey');
      const { queueName, callSid, taskSid, surveyKey } = event;

      const url = `https://6e6d12fab128.ngrok.app/features/post-call-survey/common/survey-questions?queueName=${queueName}&callSid=${callSid}&taskSid=${taskSid}&surveyKey=${surveyKey}&questionIndex=0`;
      // const url = `https://${context.DOMAIN_NAME}/features/post-call-survey/common/survey-questions?queueName=${queueName}&callSid=${callSid}&taskSid=${taskSid}&surveyKey=${surveyKey}&questionIndex=0`;
      console.log(url);

      const params = {
        method: 'POST',
        url: encodeURI(url),
      };

      const result = await VoiceOperations.updateCall({
        context,
        callSid,
        params,
      });

      console.log('result:', result);
      const { call, status } = result;

      response.setStatusCode(status);
      response.setBody({ call, ...extractStandardResponse(result) });
      return callback(null, response);
    } catch (error) {
      console.log(error);
      return handleError(error);
    }
  }
);
