/*
 * TwiML for the <Enqueue> waitUrl. Callers will hear the messaging and hold music while in queue to speak to an agent.
 * They can - at any point - press the star key to leave a voicemail and abandon the ongoing call.
 *
 */
const VoiceOperations = require(Runtime.getFunctions()['common/twilio-wrappers/programmable-voice'].path);
const TaskRouterOperations = require(Runtime.getFunctions()['common/twilio-wrappers/taskrouter'].path);
const CallbackOperations = require(Runtime.getFunctions()['features/callback-and-voicemail/common/callback-operations']
  .path);

const options = {
  sayOptions: { voice: 'Polly.Joanna' },
  holdMusicUrl: 'http://com.twilio.music.soft-rock.s3.amazonaws.com/_ghost_-_promo_2_sample_pack.mp3',
  messages: {
    initialGreeting: 'Please wait while we direct your call to the next available representative.',
    repeatingPrompt:
      'To request a callback, or to leave a voicemail, press the star key at anytime... Otherwise, please continue to hold.',
    callbackOrVoicemailChoice:
      'To request a callback when a representative becomes available, press 1. \
          To leave a voicemail for the next available representative, press 2. \
          To continue holding, press any other key, or remain on the line.',
    callbackSubmitted: 'Thank you. A callback has been requested. You will receive a call shortly. Goodbye.',
    recordVoicemailPrompt:
      'Please leave a message at the tone. When you are finished recording, you may hang up, or press the star key.',
    voicemailNotCaptured: "Sorry. We weren't able to capture your message.",
    voicemailRecorded: 'Your voicemail has been successfully recorded... Goodbye',
    callbackAndVoicemailUnavailable:
      'The option to request a callback or leave a voicemail is not available at this time. Please continue to hold.',
    processingError: 'Sorry, we were unable to perform this operation. Please remain on the line.',
  },
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
  // Limiting to a single max payload size of 50 since the task should be top of the list.
  // Fine tuning of this value can be done based on anticipated call volume and validated through load testing.
  const result = await TaskRouterOperations.getTasks({
    context,
    assignmentStatus: ['pending', 'reserved'],
    workflowSid,
    ordering: 'DateCreated:desc',
    limit: 50,
  });

  return result.tasks?.find((task) => task.attributes.call_sid === callSid);
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
      abandoned: 'Follow-Up',
    },
  };

  return TaskRouterOperations.updateTask({
    context,
    taskSid: task.sid,
    updateParams: {
      assignmentStatus: 'canceled',
      reason: cancelReason,
      attributes: JSON.stringify(newAttributes),
    },
  });
}

/**
 * Updates the call with callback or voicemail TwiML URL, and then cancels the ongoing call task with the appropriate reason and attributes.
 *
 * Much of the logic is the same for callback or voicemail, so we're using this single function to handle both.
 *
 * @param {*} context
 * @param {*} isVoicemail
 * @param {*} callSid
 * @param {*} taskSid
 * @returns
 */
async function handleCallbackOrVoicemailSelected(context, isVoicemail, callSid, taskSid) {
  const twiml = new Twilio.twiml.VoiceResponse();
  const domain = `https://${context.DOMAIN_NAME}`;

  const cancelReason = isVoicemail ? 'Opted to leave a voicemail' : 'Opted to request a callback';
  const mode = isVoicemail ? 'record-voicemail' : 'submit-callback';

  const task = await fetchTask(context, taskSid);

  // Redirect Call to callback or voicemail logic. We need to update the call with a new TwiML URL vs using twiml.redirect() - since
  // we are still in the waitUrl TwiML execution - and it's not possible to use the <Record> verb in here. We piggyback on the same approach for callbacks,
  // though technically these could be handled entirely in the waitUrl TwiML
  const result = await VoiceOperations.updateCall({
    context,
    callSid,
    params: {
      method: 'POST',
      url: `${domain}/features/callback-and-voicemail/studio/wait-experience?mode=${mode}&CallSid=${callSid}&enqueuedTaskSid=${taskSid}`,
    },
  });
  const { success, status } = result;

  if (success) {
    //  Cancel (update) the task with handy attributes for reporting
    await cancelTask(context, task, cancelReason);
  } else {
    console.error(`Failed to update call ${callSid} with new TwiML. Status: ${status}`);
    twiml.say(options.sayOptions, options.messages.processingError);
    twiml.redirect(
      `${domain}/features/callback-and-voicemail/studio/wait-experience?mode=main-wait-loop&CallSid=${callSid}&enqueuedTaskSid=${taskSid}&skipGreeting=true`,
    );
    return twiml;
  }
  return '';
}

exports.handler = async (context, event, callback) => {
  const twiml = new Twilio.twiml.VoiceResponse();
  const domain = `https://${context.DOMAIN_NAME}`;
  let holdMusicUrl = options.holdMusicUrl;

  // Make relative hold music URLs absolute
  // <Play> does not support relative URLs
  if (!holdMusicUrl.startsWith('http://') && !holdMusicUrl.startsWith('https://')) {
    holdMusicUrl = domain + holdMusicUrl;
  }

  const { Digits, CallSid, QueueSid, mode, enqueuedTaskSid, skipGreeting } = event;

  switch (mode) {
    case 'initialize':
      // Initial logic to find the associated task for the call, and propagate it through to the rest of the TwiML execution
      // If the lookup fails to find the task, the remaining TwiML logic will not offer any callback or voicemail options.
      const enqueuedWorkflowSid = (await VoiceOperations.fetchVoiceQueue({ context, queueSid: QueueSid }))
        .queueProperties.friendlyName;
      console.log(`Enqueued workflow sid: ${enqueuedWorkflowSid}`);
      const enqueuedTask = await getPendingTaskByCallSid(context, CallSid, enqueuedWorkflowSid);

      const redirectBaseUrl = `${domain}/features/callback-and-voicemail/studio/wait-experience?mode=main-wait-loop&CallSid=${CallSid}`;

      if (enqueuedTask) {
        twiml.redirect(redirectBaseUrl + (enqueuedTask ? `&enqueuedTaskSid=${enqueuedTask.sid}` : ''));
      } else {
        // Log an error for our own debugging purposes, but don't fail the call
        console.error(
          `Failed to find the pending task with callSid: ${CallSid}. This is potentially due to higher call volume than the API query had accounted for.`,
        );
        twiml.redirect(redirectBaseUrl);
      }
      return callback(null, twiml);

    case 'main-wait-loop':
      if (skipGreeting !== 'true') {
        twiml.say(options.sayOptions, options.messages.initialGreeting);
      }
      if (enqueuedTaskSid) {
        // Nest the <Say>/<Play> within the <Gather> to allow the caller to press a key at any time during the nested verbs' execution.
        const initialGather = twiml.gather({
          input: 'dtmf',
          timeout: '2',
          action: `${domain}/features/callback-and-voicemail/studio/wait-experience?mode=handle-initial-choice&CallSid=${CallSid}&enqueuedTaskSid=${enqueuedTaskSid}`,
        });
        initialGather.say(options.sayOptions, options.messages.repeatingPrompt);
        initialGather.play(holdMusicUrl);
      } else {
        // If the task lookup failed to find the task previously, don't offer callback or voicemail options - since we aren't able to cancel
        // the ongoing call task
        twiml.say(options.sayOptions, options.messages.callbackAndVoicemailUnavailable);
        twiml.play(holdMusicUrl);
      }
      // Loop back to the start if we reach this point
      twiml.redirect(
        `${domain}/features/callback-and-voicemail/studio/wait-experience?mode=main-wait-loop&CallSid=${CallSid}&enqueuedTaskSid=${enqueuedTaskSid}&skipGreeting=true`,
      );
      return callback(null, twiml);

    case 'handle-initial-choice':
      // If the caller pressed the star key, prompt for callback or voicemail
      if (Digits === '*') {
        // Nest the <Say>/<Play> within the <Gather> to allow the caller to press a key at any time during the nested verbs' execution.
        const callbackOrVoicemailGather = twiml.gather({
          input: 'dtmf',
          timeout: '2',
          action: `${domain}/features/callback-and-voicemail/studio/wait-experience?mode=handle-callback-or-voicemail-choice&CallSid=${CallSid}&enqueuedTaskSid=${enqueuedTaskSid}`,
        });
        callbackOrVoicemailGather.say(options.sayOptions, options.messages.callbackOrVoicemailChoice);
      }

      // Loop back to the start of the wait loop
      twiml.redirect(
        `${domain}/features/callback-and-voicemail/studio/wait-experience?mode=main-wait-loop&CallSid=${CallSid}&enqueuedTaskSid=${enqueuedTaskSid}&skipGreeting=true`,
      );
      return callback(null, twiml);

    case 'handle-callback-or-voicemail-choice':
      if (Digits === '1' || Digits === '2') {
        // 1 = callback, 2 = voicemail
        const isVoicemail = Digits === '2';
        return callback(null, await handleCallbackOrVoicemailSelected(context, isVoicemail, CallSid, enqueuedTaskSid));
      }

      // Loop back to the start of the wait loop if the caller pressed any other key
      twiml.redirect(
        `${domain}/features/callback-and-voicemail/studio/wait-experience?mode=main-wait-loop&CallSid=${CallSid}&enqueuedTaskSid=${enqueuedTaskSid}&skipGreeting=true`,
      );
      return callback(null, twiml);

    case 'submit-callback':
      // Create the Callback task
      // Option to pull in a few more things from original task like conversation_id or even the workflowSid
      await CallbackOperations.createCallbackTask({
        context,
        numberToCall: event.Caller,
        numberToCallFrom: event.Called,
      });

      // End the interaction. Hangup the call.
      twiml.say(options.sayOptions, options.messages.callbackSubmitted);
      twiml.hangup();
      return callback(null, twiml);

    case 'record-voicemail':
      //  Main logic for Recording the voicemail
      twiml.say(options.sayOptions, options.messages.recordVoicemailPrompt);
      twiml.record({
        action: `${domain}/features/callback-and-voicemail/studio/wait-experience?mode=voicemail-recorded&CallSid=${CallSid}&enqueuedTaskSid=${enqueuedTaskSid}`,
        transcribeCallback: `${domain}/features/callback-and-voicemail/studio/wait-experience?mode=submit-voicemail&CallSid=${CallSid}&enqueuedTaskSid=${enqueuedTaskSid}`,
        method: 'GET',
        playBeep: 'true',
        transcribe: true,
        timeout: 10,
        finishOnKey: '*',
      });
      twiml.say(options.sayOptions, options.messages.voicemailNotCaptured);
      twiml.redirect(
        `${domain}/features/callback-and-voicemail/studio/wait-experience?mode=record-voicemail&CallSid=${CallSid}&enqueuedTaskSid=${enqueuedTaskSid}`,
      );
      return callback(null, twiml);

    case 'voicemail-recorded':
      // End the interaction. Hangup the call.
      twiml.say(options.sayOptions, options.messages.voicemailRecorded);
      twiml.hangup();
      return callback(null, twiml);

    case 'submit-voicemail':
      // Submit the voicemail to Taskrouter (and/or to your backend if you have a voicemail handling solution)

      // Create the Voicemail task
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

      return callback(null, '');

    default:
      //  Default case - if we don't recognize the mode, redirect to the main wait loop
      twiml.say(options.sayOptions, options.messages.processingError);
      twiml.redirect(
        `${domain}/features/callback-and-voicemail/studio/wait-experience?mode=main-wait-loop&CallSid=${CallSid}&enqueuedTaskSid=${enqueuedTaskSid}&skipGreeting=true`,
      );
      return callback(null, twiml);
  }
};
