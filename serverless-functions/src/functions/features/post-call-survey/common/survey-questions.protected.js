const TaskOperations = require(Runtime.getFunctions()['common/twilio-wrappers/taskrouter'].path);
const { twilioExecute } = require(Runtime.getFunctions()['common/helpers/function-helper'].path);

exports.handler = async (context, event, callback) => {
  console.log('PCS >> Incoming >>', event);

  const twiml = new Twilio.twiml.VoiceResponse();

  const { queueName, callSid, taskSid, surveyKey, Digits } = event;
  let { questionIndex, surveyTaskSid, attributes } = event;

  questionIndex = parseInt(questionIndex, 10);
  const digits = parseInt(Digits, 10);
  console.log(`attributes: ${attributes}`);
  attributes = attributes ? JSON.parse(attributes) : { conversations: {} };
  console.log('attributes 2:', attributes);

  // UPDATE: Rethink serverless wrappers #492
  const result = await twilioExecute(context, async (client) => {
    try {
      return await client.sync.v1
        .services(context.TWILIO_FLEX_SYNC_SID)
        .syncMaps(context.TWILIO_FLEX_POST_CALL_SURVEY_SYNC_MAP_SID)
        .syncMapItems(surveyKey)
        .fetch();
    } catch (error) {
      twiml.say("I'm sorry an error occurred in the post call survey. Goodbye.");
      // Re-throw the error for the retry handler to catch
      return callback(null, twiml);
    }
  });

  if (result.success) {
    console.log('Twilio Fetch Survey from sync API response:', result.data);
  }

  const mapItem = result.data;
  console.log('mapItem: ', mapItem);

  const survey = mapItem.data;
  console.log('survey:', survey);

  if (questionIndex === 0) {
    twiml.say(survey.message_intro);

    const conversations = {
      conversation_id: taskSid,
      queue: queueName,
      virtual: 'Yes',
      abandoned: 'Yes',
      ivr_time: 0,
      talk_time: 0,
      ring_time: 0,
      queue_time: 0,
      wrap_up_time: 0,
      kind: 'Survey',
    };

    attributes.conversations = conversations;

    const taskResult = await TaskOperations.createTask({
      context,
      workflowSid: context.TWILIO_FLEX_POST_CALL_SURVEY_WORKFLOW_SID,
      taskChannel: 'voice',
      attributes,
      timeout: 300,
    });

    console.log('create taskResult', taskResult);
    surveyTaskSid = taskResult.data.sid;
    console.log(`Survey task SID: ${surveyTaskSid}`);
    attributes = taskResult.data.attributes;
  } else {
    attributes.conversations[`conversation_label_${questionIndex}`] = survey.questions[questionIndex - 1].label;
    attributes.conversations[`conversation_attribute_${questionIndex}`] = digits;

    const updateTaskResult = await TaskOperations.updateTask({
      taskSid: surveyTaskSid,
      updateParams: { attributes: JSON.stringify(attributes) },
      context,
    });
    attributes = updateTaskResult.data.attributes || attributes;
  }

  if (questionIndex === survey.questions.length) {
    attributes.conversations.abandoned = 'No';
    console.log('taskSid', taskSid);

    const updateTaskResult = await TaskOperations.updateTask({
      taskSid: surveyTaskSid,
      updateParams: {
        reason: 'Survey completed',
        assignmentStatus: 'canceled',
        attributes: JSON.stringify(attributes),
      },
      context,
    });

    attributes = updateTaskResult.data.attributes || attributes;

    twiml.say(survey.message_end);
  } else {
    const question = survey.questions[parseInt(questionIndex, 10)];
    twiml.say(question.prompt);
    const nextQuestion = questionIndex + 1;

    const nextUrl = `https://${
      context.DOMAIN_NAME
    }/features/post-call-survey/common/survey-questions?callSid=${callSid}&taskSid=${taskSid}&surveyKey=${surveyKey}&queueName=${queueName}&surveyTaskSid=${surveyTaskSid}&questionIndex=${nextQuestion}&attributes=${encodeURIComponent(
      JSON.stringify(attributes),
    )}`;

    console.log(`Next URL: ${nextUrl}`);

    twiml.gather({
      timeout: 10,
      numDigits: 1,
      method: 'POST',
      action: nextUrl,
    });
  }

  return callback(null, twiml);
};
