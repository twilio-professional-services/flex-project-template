/*
 * TwiML for the <Enqueue> waitUrl. Callers will hear the messaging and hold music while in queue to speak to an agent.
 * They can - at any point - press the star key to leave a voicemail and abandon the ongoing call.
 *
 */
const TaskRouterOperations = require(Runtime.getFunctions()[
  "common/twilio-wrappers/taskrouter"
].path);
const VoiceOperations = require(Runtime.getFunctions()[
  "common/twilio-wrappers/programmable-voice"
].path);
const CallbackOperations = require(Runtime.getFunctions()[
  "features/callback-and-voicemail/common/callback-operations"
].path);

const options = {
  sayOptions: { voice: "Polly.Joanna" },
  holdMusicUrl: "/features/callback-and-voicemail/wait-experience-music.mp3",
};

async function fetchTask(context, taskSid) {
  const result = await TaskRouterOperations.fetchTask({
    context,
    attempts: 0,
    taskSid,
  });
  return result.task;
}

async function getTaskByCallSid(context, callSid) {
  const result = await TaskRouterOperations.listTasksByAttributes({
    context,
    attempts: 0,
    evaluation: `call_sid = '${callSid}'`,
  });
  console.log("getTaskByCallSid result: ", result);
  result.tasks.forEach((task) => console.log("task: ", task));
  return result.tasks?.length > 0 ? result.tasks[0] : null;
}

/**
 * Cancels the task and updates the attributes to reflect the abandoned status.
 * We don't want voicemails to contribute to abandoned task metrics.
 *
 * @param {*} context
 * @param {*} task
 */
async function cancelTask(context, task) {
  const newAttributes = {
    ...task.attributes,
    conversations: {
      ...task.attributes.conversations,
      abandoned: "Follow-Up",
    },
  };

  return await TaskRouterOperations.updateTask({
    context,
    taskSid: task.sid,
    updateParams: {
      assignmentStatus: "canceled",
      reason: "Voicemail Request",
      attributes: JSON.stringify(newAttributes),
    },
    attempts: 0,
  });
}

exports.handler = async function (context, event, callback) {
  const domain = `https://${context.DOMAIN_NAME}`;
  const twiml = new Twilio.twiml.VoiceResponse();

  // Retrieve options
  const { sayOptions, holdMusicUrl } = options;

  // Retrieve event arguments
  const { digits, mode, CallSid, TaskSid } = event;

  console.log("Digits: ", digits);
  console.log("Mode: ", mode);

  let message = "";

  switch (mode) {
    case "main-wait-loop":
      if (event.skipGreeting !== "true") {
        const initGreeting =
          "...Please wait while we direct your call to the next available specialist...";
        twiml.say(sayOptions, initGreeting);
      }
      message =
        "To leave a voicemail, press the star key at anytime... Otherwise, please continue to hold";
      // Nest the <Say>/<Play> within the <Gather> to allow the caller to press a key at any time during the nested verbs' execution.
      const gather = twiml.gather({
        input: "dtmf",
        timeout: "2",
        action: `${domain}/features/callback-and-voicemail/studio/wait-url/wait-experience?mode=handle-key-pressed`,
      });
      gather.say(sayOptions, message);
      gather.play(domain + holdMusicUrl);
      console.log(`Play music: ${domain + holdMusicUrl}`);
      // Loop back to the start if we reach this point
      twiml.redirect(
        `${domain}/features/callback-and-voicemail/studio/wait-url/wait-experience?mode=main-wait-loop`
      );
      return callback(null, twiml);
    case "handle-key-pressed":
      if (event.Digits === "*") {
        //  leave a voicemail
        twiml.redirect(
          `${domain}/features/callback-and-voicemail/studio/wait-url/wait-experience?mode=prepare-to-record-voicemail`
        );
        return callback(null, twiml);
      }
      twiml.say(sayOptions, "I did not understand your selection.");
      twiml.redirect(
        `${domain}/features/callback-and-voicemail/studio/wait-url/wait-experience?mode=main-wait-loop&skipGreeting=true`
      );
      return callback(null, twiml);
    case "prepare-to-record-voicemail":
      //  initial logic to cancel the task and prepare the call for Recording
      //  Get taskSid based on CallSid
      // TODO: Use a more scalable approach to retrieve the taskSid (e.g. set taskSid in Call Annotations)
      task = await getTaskByCallSid(context, CallSid);

      // Redirect Call to Voicemail main menu
      const redirectUrl = `${domain}/features/callback-and-voicemail/studio/wait-url/wait-experience?mode=record-voicemail&taskSid=${task.sid}`;
      const result = await VoiceOperations.updateCall({
        context,
        callSid: CallSid,
        params: { method: "POST", url: redirectUrl },
        attempts: 0,
      });
      const { success, call, status } = result;

      if (success) {
        //  Cancel (update) the task with handy attributes for reporting
        await cancelTask(context, task);
      } else {
        console.error(
          `Failed to update call ${CallSid} with new TwiML. Status: ${status}`
        );
        twiml.say(
          sayOptions,
          "Sorry, we are unable to redirect you to voicemail right now."
        );
        twiml.redirect(
          `${domain}/features/callback-and-voicemail/studio/wait-url/wait-experience?mode=main-wait-loop?skipGreeting=true`
        );
        return callback(null, twiml);
      }
      return callback(null, "");
    case "record-voicemail":
      //  Main logic for Recording the voicemail
      twiml.say(
        sayOptions,
        "Please leave a message at the tone.  Press the star key when finished."
      );
      twiml.record({
        action: `${domain}/features/callback-and-voicemail/studio/wait-url/wait-experience?mode=voicemail-recorded&CallSid=${CallSid}&TaskSid=${TaskSid}`,
        transcribeCallback: `${domain}/features/callback-and-voicemail/studio/wait-url/wait-experience?mode=submit-voicemail&CallSid=${CallSid}&TaskSid=${TaskSid}`,
        method: "GET",
        playBeep: "true",
        transcribe: true,
        timeout: 10,
        finishOnKey: "*",
      });
      twiml.say(sayOptions, "I did not capture your recording");
      twiml.redirect(
        `${domain}/features/callback-and-voicemail/studio/wait-url/wait-experience?mode=record-voicemail`
      );
      return callback(null, twiml);
    case "voicemail-recorded":
      // End the interaction. Hangup the call.
      twiml.say(
        sayOptions,
        "Your voicemail has been successfully received... goodbye"
      );
      twiml.hangup();
      return callback(null, twiml);
    case "submit-voicemail":
      //  Submit the voicemail to Taskrouter (and/or to your backend if you have a voicemail handling solution)
      // task = await fetchTask(context, event.taskSid);
      // const { taskAttributes } = task;

      console.log(`Caller ${event.Caller} Called ${event.Called}}`);
      //  create the Voicemail task
      // TODO: Pull in a few more things from original task like conversation_id
      await CallbackOperations.createCallbackTask({
        context,
        numberToCall: event.Caller,
        numberToCallFrom: event.Called,
        recordingSid: event.RecordingSid,
        recordingUrl: event.RecordingUrl,
        transcriptSid: event.TranscriptionSid,
        transcriptText: event.TranscriptionText,
      });

      // const ringBackUrl = VoiceMailAlertTone.startsWith("https://")
      //   ? VoiceMailAlertTone
      //   : domain + VoiceMailAlertTone;
      // await createVoicemailTask(
      //   event,
      //   client,
      //   task,
      //   context.VOICEMAIL_WORKFLOW_SID,
      //   ringBackUrl
      // );
      return callback(null, "");
    default:
      twiml.say(
        sayOptions,
        "Sorry, invalid mode supplied to wait URL. This is a bug in the code."
      );
      return callback(null, twiml);
  }
};
