const { map, at } = require('lodash');

const SyncOperations = require(Runtime.getFunctions()[
  'common/twilio-wrappers/sync'
].path);

const TaskOperations = require(Runtime.getFunctions()[
  'common/twilio-wrappers/taskrouter'
].path);

exports.handler = async (context, event, callback) => {
  const twiml = new Twilio.twiml.VoiceResponse();
  // twiml.say('This is the survey.');

  let {
    queueName,
    callSid,
    taskSid,
    surveyKey,
    Digits,
    questionIndex,
    newTaskSid,
    attributes,
  } = event;

  questionIndex = parseInt(questionIndex);
  const digits = parseInt(Digits);
  console.log(`attributes: ${attributes}`);
  attributes = attributes ? JSON.parse(attributes) : { conversations: {} };
  console.log('attributes 2:', attributes);

  const { mapItem } = await SyncOperations.fetchMapItem({
    context,
    mapSid: 'Post Call Survey Definitions',
    key: surveyKey,
  });
  console.log('mapItem: ', mapItem);

  const survey = mapItem.data;
  console.log('survey:', survey);

  if (questionIndex === 0) {
    twiml.say(survey.message_intro);

    let conversations = {};
    conversations.conversation_id = taskSid;
    conversations.queue = queueName;
    conversations.virtual = 'Yes';
    conversations.abandoned = 'Yes';
    conversations.ivr_time = 0;
    conversations.talk_time = 0;
    conversations.ring_time = 0;
    conversations.queue_time = 0;
    conversations.wrap_up_time = 0;
    conversations.kind = 'Survey';

    attributes.conversations = conversations;

    const taskResult = await TaskOperations.createTask({
      context,
      workflowSid: context.TWILIO_FLEX_POST_CALL_SURVEY_WORKFLOW_SID,
      taskChannel: 'voice',
      attributes,
      timeout: 300,
    });

    console.log('taskResult', taskResult);
    taskSid = taskResult.taskSid;
    attributes = taskResult.task.attributes;
  } else {
    attributes.conversations[`conversation_label_${questionIndex}`] =
      survey.questions[questionIndex - 1].label;
    attributes.conversations[`conversation_attribute_${questionIndex}`] =
      digits;

    const updateTaskResult = await TaskOperations.updateTask({
      taskSid,
      updateParams: attributes,
      context,
    });

    attributes = updateTaskResult.task.attributes || attributes;
  }

  if (questionIndex === survey.questions.length) {
    attributes.conversations.abandoned = 'No';
    console.log('taskSid', taskSid);

    const updateTaskResult = await TaskOperations.updateTask({
      taskSid,
      updateParams: attributes,
      context,
    });

    attributes = updateTaskResult.task.attributes || attributes;

    twiml.say(survey.message_end);
  } else {
    // TODO: validate questionIndex
    var question = survey.questions[parseInt(questionIndex)];
    twiml.say(question.prompt);
    const nextQuestion = questionIndex + 1;
    twiml.gather({
      timeout: 10,
      numDigits: 1,
      method: 'POST',
      action: encodeURI(
        // `https://${context.DOMAIN_NAME}/survey-questions?callSid=${callSid}&taskSid=${taskSid}&newTaskSid=${newTaskSid}&questionIndex=${nextQuestion}&attributes=${attributes}`
        `https://6e6d12fab128.ngrok.app/features/post-call-survey/common/survey-questions?callSid=${callSid}&taskSid=${taskSid}&surveyKey=${surveyKey}&queueName=${queueName}&newTaskSid=${newTaskSid}&questionIndex=${nextQuestion}&attributes=${JSON.stringify(
          attributes
        )}`
      ),
    });
  }

  return callback(null, twiml);
};
