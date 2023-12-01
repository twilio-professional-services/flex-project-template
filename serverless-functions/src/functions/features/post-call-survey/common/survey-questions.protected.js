const { map } = require('lodash');

const SyncOperations = require(Runtime.getFunctions()[
  'common/twilio-wrappers/sync'
].path);

exports.handler = async (context, event, callback) => {
  const twiml = new Twilio.twiml.VoiceResponse();
  twiml.say('This is the survey.');

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
    // let newTask = await createTask(context, taskSid, queueName);
    // newTaskSid = newTask.sid;
    // attributes = newTask.attributes;
  } else {
    // update score
    // let task = await updateTask(
    //   context,
    //   newTaskSid,
    //   questionIndex,
    //   Digits,
    //   attributes
    // );
    // attributes = task.attributes;
  }

  if (questionIndex === survey.questions.length) {
    // await completeTask(context, newTaskSid, attributes);
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
        `https://6e6d12fab128.ngrok.app/features/post-call-survey/common/survey-questions?callSid=${callSid}&taskSid=${taskSid}&surveyKey=${surveyKey}&queueName=${queueName}&newTaskSid=${newTaskSid}&questionIndex=${nextQuestion}&attributes=${attributes}`
      ),
    });
  }

  return callback(null, twiml);
};
