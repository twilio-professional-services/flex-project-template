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

/**
 * Utility function to retrieve all recent pending tasks for the supplied workflow, and find the one that matches our call SID.
 * This avoids the need to use EvaluateTaskAttributes which is strictly rate limited to 3 RPS.
 * @param {*} context
 * @param {*} callSid
 * @param {*} workflowSid
 * @returns
 */
async function getPendingTaskByCallSid(context, callSid, workflowSid) {
  const result = await TaskRouterOperations.getTasks({
    context,
    attempts: 0,
    assignmentStatus: "pending",
    workflowSid,
    ordering: "DateCreated:desc",
  });
  return result.tasks?.find((task) => task.attributes.callSid === callSid);
}

/**
 *
 * @param {*} context
 * @param {*} taskSid
 * @returns
 */
async function fetchTask(context, taskSid) {
  const result = await TaskRouterOperations.fetchTask({
    context,
    taskSid,
    attempts: 0,
  });
  return result.task;
}
/**
 * Cancels the task and updates the attributes to reflect the abandoned status.
 * We don't want callbacks or voicemails to contribute to abandoned task metrics.
 *
 * @param {*} context
 * @param {*} task
 * @param {*} cancelReason
 */
async function cancelTask(context, task, cancelReason) {
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
      reason: cancelReason,
      attributes: JSON.stringify(newAttributes),
    },
    attempts: 0,
  });
}

/**
 * Updates the call with voicemail TwiML URL, and then cancels the ongoing call task with the appropriate reason and attributes.
 *
 * @param {*} context
 * @param {*} callSid
 * @param {*} taskSid
 * @returns
 */
async function prepareForVoicemail(context, isVoicemail, callSid, taskSid) {
  const domain = `https://${context.DOMAIN_NAME}`;
  const twiml = new Twilio.twiml.VoiceResponse();

  // Initial logic to cancel the task and prepare the call for Recording
  const task = await fetchTask(context, taskSid);

  // Redirect Call to voicemail logic. We need to update the call with a new TwiML URL vs using twiml.redirect() - since
  // we are still in the waitUrl TwiML execution - and it's not possible to use the <Record> verb in here.
  const redirectUrl = `${domain}/features/callback-and-voicemail/studio/wait-url/wait-experience?mode=record-voicemail&taskSid=${taskSid}&CallSid=${callSid}`;
  const result = await VoiceOperations.updateCall({
    context,
    callSid,
    params: { method: "POST", url: redirectUrl },
    attempts: 0,
  });
  const { success, status } = result;

  if (success) {
    //  Cancel (update) the task with handy attributes for reporting
    await cancelTask(context, task, "Opted to leave voicemail");
  } else {
    console.error(
      `Failed to update call ${callSid} with new TwiML. Status: ${status}`
    );
    twiml.say(
      sayOptions,
      "Sorry, we were unable to perform this operation. Please remain on the line."
    );
    twiml.redirect(
      `${domain}/features/callback-and-voicemail/studio/wait-url/wait-experience?mode=main-wait-loop&CallSid=${callSid}&taskSid=${taskSid}&skipGreeting=true`
    );
    return twiml;
  }
  return "";
}

exports.handler = async function (context, event, callback) {
  const domain = `https://${context.DOMAIN_NAME}`;
  const twiml = new Twilio.twiml.VoiceResponse();

  // Retrieve options
  const { sayOptions, holdMusicUrl } = options;

  const { Digits, CallSid, WorkflowSid, mode, taskSid, skipGreeting } = event;

  let message = "";

  switch (mode) {
    case "initialize":
      // Initial logic to find the associated task for the call, and propagate it through to the rest of the TwiML execution
      // If the lookup fails to find the task, the remaining TwiML logic will not offer any callback or voicemail options.
      const task = await getPendingTaskByCallSid(context, CallSid, WorkflowSid);
      twiml.redirect(
        `${domain}/features/callback-and-voicemail/studio/wait-url/wait-experience?mode=main-wait-loop&CallSid=${CallSid}&taskSid=${task?.sid}`
      );
      return callback(null, twiml);

    case "main-wait-loop":
      if (skipGreeting !== "true") {
        const initGreeting =
          "...Please wait while we direct your call to the next available specialist...";
        twiml.say(sayOptions, initGreeting);
      }
      if (taskSid) {
        message =
          "To request a callback, or to leave a voicemail, press the star key at anytime... Otherwise, please continue to hold";
        // Nest the <Say>/<Play> within the <Gather> to allow the caller to press a key at any time during the nested verbs' execution.
        const initialGather = twiml.gather({
          input: "dtmf",
          timeout: "2",
          action: `${domain}/features/callback-and-voicemail/studio/wait-url/wait-experience?mode=handle-initial-choice&CallSid=${CallSid}&taskSid=${taskSid}`,
        });
        initialGather.say(sayOptions, message);
        initialGather.play(domain + holdMusicUrl);
      } else {
        // If the task lookup failed to find the task previously, don't offer callback or voicemail options - since we aren't able to cancel
        // the ongoing call task
        message =
          "The option to request a callback or leave a voicemail is not available at this time. Please continue to hold.";
        twiml.say(sayOptions, message);
        twiml.play(domain + holdMusicUrl);
      }
      // Loop back to the start if we reach this point
      twiml.redirect(
        `${domain}/features/callback-and-voicemail/studio/wait-url/wait-experience?mode=main-wait-loop&CallSid=${CallSid}&taskSid=${taskSid}&skipGreeting=true`
      );
      return callback(null, twiml);

    case "handle-initial-choice":
      // If the caller pressed the star key, prompt for callback or voicemail
      if (Digits === "*") {
        ("To request a callback when a representative becomes available, press 1. \
          To leave a voicemail for the next available representative, press 2. \
          To continue holding, press any other key, or remain on the line.");
        // Nest the <Say>/<Play> within the <Gather> to allow the caller to press a key at any time during the nested verbs' execution.
        const callbackOrVoicemailGather = twiml.gather({
          input: "dtmf",
          timeout: "2",
          action: `${domain}/features/callback-and-voicemail/studio/wait-url/wait-experience?mode=handle-callback-or-voicemail-choice&CallSid=${CallSid}&taskSid=${taskSid}`,
        });
        callbackOrVoicemailGather.say(sayOptions, message);
      }

      // Loop back to the start of the wait loop
      twiml.redirect(
        `${domain}/features/callback-and-voicemail/studio/wait-url/wait-experience?mode=main-wait-loop&CallSid=${CallSid}&taskSid=${taskSid}&skipGreeting=true`
      );
      return callback(null, twiml);

    case "handle-callback-or-voicemail-choice":
      if (Digits === "1") {
        // 1 = callback. Redirect to submit the callback
        twiml.redirect(
          `${domain}/features/callback-and-voicemail/studio/wait-url/wait-experience?mode=submit-callback&taskSid=${taskSid}&CallSid=${callSid}`
        );
        return callback(null, twiml);
      } else if (Digits === "2") {
        // 2 = voicemail
        return callback(
          null,
          await prepareForVoicemail(context, CallSid, taskSid)
        );
      }

      // Loop back to the start of the wait loop if the caller pressed any other key
      twiml.redirect(
        `${domain}/features/callback-and-voicemail/studio/wait-url/wait-experience?mode=main-wait-loop&CallSid=${CallSid}&taskSid=${taskSid}&skipGreeting=true`
      );
      return callback(null, twiml);

    case "submit-callback":
      //  Cancel (update) the ongoing call task with handy attributes for reporting
      await cancelTask(context, task, "Opted to request callback");

      // Create the Callback task
      // Option to pull in a few more things from original task like conversation_id or even the workflowSid
      await CallbackOperations.createCallbackTask({
        context,
        numberToCall: event.Caller,
        numberToCallFrom: event.Called,
      });

      // End the interaction. Hangup the call.
      twiml.say(
        sayOptions,
        "Your callback has been successfully requested. You will receive a call shortly. Goodbye."
      );
      twiml.hangup();
      return callback(null, twiml);

    case "record-voicemail":
      //  Main logic for Recording the voicemail
      twiml.say(
        sayOptions,
        "Please leave a message at the tone.  Press the star key when finished."
      );
      twiml.record({
        action: `${domain}/features/callback-and-voicemail/studio/wait-url/wait-experience?mode=voicemail-recorded&CallSid=${CallSid}&taskSid=${taskSid}`,
        transcribeCallback: `${domain}/features/callback-and-voicemail/studio/wait-url/wait-experience?mode=submit-voicemail&CallSid=${CallSid}&taskSid=${taskSid}`,
        method: "GET",
        playBeep: "true",
        transcribe: true,
        timeout: 10,
        finishOnKey: "*",
      });
      twiml.say(sayOptions, "We weren't able to capture your message.");
      twiml.redirect(
        `${domain}/features/callback-and-voicemail/studio/wait-url/wait-experience?mode=record-voicemail&CallSid=${CallSid}&taskSid=${taskSid}`
      );
      return callback(null, twiml);

    case "voicemail-recorded":
      // End the interaction. Hangup the call.
      twiml.say(
        sayOptions,
        "Your voicemail has been successfully recorded... Goodbye"
      );
      twiml.hangup();
      return callback(null, twiml);

    case "submit-voicemail":
      //  Submit the voicemail to Taskrouter (and/or to your backend if you have a voicemail handling solution)

      //  Create the Voicemail task
      // Option to pull in a few more things from original task like conversation_id or even the workflowSid
      await CallbackOperations.createCallbackTask({
        context,
        numberToCall: event.Caller,
        numberToCallFrom: event.Called,
        recordingSid: event.RecordingSid,
        recordingUrl: event.RecordingUrl,
        transcriptSid: event.TranscriptionSid,
        transcriptText: event.TranscriptionText,
      });

      return callback(null, "");

    default:
      //  Default case - if we don't recognize the mode, redirect to the main wait loop
      twiml.say(
        sayOptions,
        "Sorry, we were unable to perform this operation. Please remain on the line."
      );
      twiml.redirect(
        `${domain}/features/callback-and-voicemail/studio/wait-url/wait-experience?mode=main-wait-loop&CallSid=${CallSid}&taskSid=${taskSid}&skipGreeting=true`
      );
      return callback(null, twiml);
  }
};
