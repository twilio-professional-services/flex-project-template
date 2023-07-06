import { ConferenceParticipant, ITask, Manager, TaskHelper } from '@twilio/flex-ui';

import TaskRouterService from '../../../utils/serverless/TaskRouter/TaskRouterService';
import { FetchedRecording } from '../../../types/serverless/twilio-api';
import { getChannelToRecord } from '../config';
import DualChannelService from './DualChannelService';

const manager = Manager.getInstance();

const addCallDataToTask = async (task: ITask, callSid: string | null, recording: FetchedRecording | null) => {
  const { conference } = task;

  let newAttributes = {} as any;
  let shouldUpdateTaskAttributes = false;

  if (TaskHelper.isOutboundCallTask(task)) {
    shouldUpdateTaskAttributes = true;
    // Last Reviewed: 2021/02/01 (YYYY/MM/DD)
    // Outbound calls initiated from Flex (via StartOutboundCall Action)
    // do not include call_sid and conference metadata in task attributes
    newAttributes.conference = { sid: conference?.conferenceSid };

    if (callSid) {
      // callSid will be undefined if the outbound call was ended before
      // the called party answered
      newAttributes.call_sid = callSid;
    }
  }

  if (recording) {
    const { dateUpdated, sid: reservationSid } = task;
    shouldUpdateTaskAttributes = true;

    const state = manager.store.getState();
    const flexState = state && state.flex;
    const workerState = flexState && flexState.worker;
    const accountSid = workerState && workerState.source?.accountSid;

    const { sid: recordingSid } = recording;
    const twilioApiBase = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}`;
    const recordingUrl = `${twilioApiBase}/Recordings/${recordingSid}`;

    // Using one second before task updated time to workaround a Flex Insights
    // bug if the recording start time is after the reservation.accepted event
    const recordingStartTime = new Date(dateUpdated).valueOf() - 1000;

    // NOTE: This schema is applicable if recording the customer leg since there
    // is a single recording for the entire call. If instead you're recording the
    // worker leg, which could result in multiple recordings per call in the case
    // of a transfer, then you'll want to use the reservation_attributes pattern:
    // https://www.twilio.com/docs/flex/developer/insights/custom-media-attached-conversations#add-media-links
    const mediaObj = {
      url: recordingUrl,
      type: 'VoiceRecording',
      start_time: recordingStartTime,
      channels: ['customer', 'others'],
    };

    switch (getChannelToRecord()) {
      case 'worker':
        newAttributes = {
          ...newAttributes,
          reservation_attributes: {
            [reservationSid]: {
              media: [mediaObj],
            },
          },
        };
        break;
      case 'customer':
        newAttributes.conversations = {
          media: [mediaObj],
        };
        break;
      default:
        break;
    }
  }

  if (shouldUpdateTaskAttributes) {
    await TaskRouterService.updateTaskAttributes(task.taskSid, newAttributes);
  }
};

const isTaskActive = (task: ITask) => {
  const { sid: reservationSid, taskStatus } = task;
  if (taskStatus === 'canceled') {
    return false;
  }
  return manager.workerClient?.reservations.has(reservationSid);
};

const waitForConferenceParticipants = async (task: ITask): Promise<ConferenceParticipant[]> =>
  new Promise((resolve) => {
    const waitTimeMs = 100;
    // For outbound calls, the customer participant doesn't join the conference
    // until the called party answers. Need to allow enough time for that to happen.
    const maxWaitTimeMs = 60000;
    let waitForConferenceInterval: null | NodeJS.Timeout = setInterval(async () => {
      const { conference } = task;

      if (!isTaskActive(task)) {
        console.debug('Call canceled, clearing waitForConferenceInterval');
        if (waitForConferenceInterval) {
          clearInterval(waitForConferenceInterval);
          waitForConferenceInterval = null;
        }
        return;
      }
      if (conference === undefined) {
        return;
      }
      let { participants } = conference;
      if (Array.isArray(participants) && participants.length < 2) {
        return;
      }
      const worker = participants.find((p) => p.participantType === 'worker' && p.isCurrentWorker);
      const customer = participants.find((p) => p.participantType === 'customer');

      if (!worker || !customer) {
        return;
      }

      if (!worker?.callSid || !customer?.callSid) {
        console.debug('Looking for call SID');
        // Flex sometimes does not provide callSid in task conference participants, check if it is in the Redux store instead
        const storeConference = manager.store.getState().flex.conferences.states.get(task.taskSid);

        if (!storeConference || !storeConference.source) {
          return;
        }

        participants = storeConference.source.participants;

        const storeWorker = participants.find((p) => p.participantType === 'worker' && p.isCurrentWorker);
        const storeCustomer = participants.find((p) => p.participantType === 'customer');

        if (!storeWorker?.callSid || !storeCustomer?.callSid) {
          console.debug('Worker and customer participants joined conference, waiting for call SID');
          return;
        }
      }

      console.debug('Worker and customer participants joined conference');
      if (waitForConferenceInterval) {
        clearInterval(waitForConferenceInterval);
        waitForConferenceInterval = null;
      }

      resolve(participants);
    }, waitTimeMs);

    setTimeout(() => {
      if (waitForConferenceInterval) {
        console.debug(`Customer participant didn't show up within ${maxWaitTimeMs / 1000} seconds`);

        if (waitForConferenceInterval) {
          clearInterval(waitForConferenceInterval);
          waitForConferenceInterval = null;
        }

        resolve([]);
      }
    }, maxWaitTimeMs);
  });

const waitForActiveCall = async (task: ITask): Promise<string> =>
  new Promise((resolve) => {
    const waitTimeMs = 100;
    // For internal calls, there is no conference, so we only have the active call to work with.
    // Wait here for the call to establish.
    const maxWaitTimeMs = 60000;
    let waitForCallInterval: null | NodeJS.Timeout = setInterval(async () => {
      if (!isTaskActive(task)) {
        console.debug('Call canceled, clearing waitForCallInterval');
        if (waitForCallInterval) {
          clearInterval(waitForCallInterval);
          waitForCallInterval = null;
        }
        return;
      }

      const { activeCall } = manager.store.getState().flex.phone;

      if (!activeCall) {
        return;
      }

      if (waitForCallInterval) {
        clearInterval(waitForCallInterval);
        waitForCallInterval = null;
      }

      resolve(activeCall.parameters.CallSid);
    }, waitTimeMs);

    setTimeout(() => {
      if (waitForCallInterval) {
        console.debug(`Call didn't activate within ${maxWaitTimeMs / 1000} seconds`);

        if (waitForCallInterval) {
          clearInterval(waitForCallInterval);
          waitForCallInterval = null;
        }

        resolve('');
      }
    }, maxWaitTimeMs);
  });

export const addMissingCallDataIfNeeded = async (task: ITask) => {
  const { attributes } = task;
  const { conference } = attributes;

  if (TaskHelper.isOutboundCallTask(task) && !conference) {
    // Only worried about outbound calls since inbound calls automatically
    // have the desired call and conference metadata
    await addCallDataToTask(task, null, null);
  }
};

const startRecording = async (task: ITask, callSid: string | undefined) => {
  if (!callSid) {
    console.warn('Unable to determine call SID for recording');
    return;
  }

  try {
    const recording = await DualChannelService.startDualChannelRecording(callSid);
    await addCallDataToTask(task, callSid, recording);
  } catch (error) {
    console.error('Unable to start dual channel recording.', error);
  }
};

export const recordInternalCall = async (task: ITask) => {
  // internal call - always record based on call SID, as conference state is unknown by Flex
  // Record only the outbound leg to prevent duplicate recordings
  console.debug('Waiting for internal call to begin');
  const callSid = await waitForActiveCall(task);
  console.debug('Recorded internal call:', callSid);

  await startRecording(task, callSid);
};

export const recordExternalCall = async (task: ITask) => {
  // We want to wait for all participants (customer and worker) to join the
  // conference before we start the recording
  console.debug('Waiting for customer and worker to join the conference');
  const participants = await waitForConferenceParticipants(task);

  let participantLeg;
  switch (getChannelToRecord()) {
    case 'customer': {
      participantLeg = participants.find((p) => p.participantType === 'customer');
      break;
    }
    case 'worker': {
      participantLeg = participants.find((p) => p.participantType === 'worker' && p.isCurrentWorker);
      break;
    }
    default:
      break;
  }

  console.debug('Recorded Participant: ', participantLeg);

  if (!participantLeg) {
    console.warn('No customer or worker participant. Not starting the call recording');
    return;
  }

  const { callSid } = participantLeg;

  await startRecording(task, callSid);
};
