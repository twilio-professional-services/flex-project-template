import { ConferenceParticipant, ITask, Manager, TaskHelper } from "@twilio/flex-ui";
import TaskRouterService from "../../../utils/serverless/TaskRouter/TaskRouterService";
import { FetchedRecording } from "../../../types/serverless/twilio-api";
import { getChannelToRecord } from '..';

const manager = Manager.getInstance();

export const addCallDataToTask = async (task: ITask, callSid: string | null, recording: FetchedRecording | null) => {
  const { attributes, conference } = task;

  let newAttributes = { ...attributes };
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
    const conversations = attributes.conversations || {};

    const state = manager.store.getState();
    const flexState = state && state.flex;
    const workerState = flexState && flexState.worker;
    const accountSid = workerState && workerState.source?.accountSid;

    const { sid: recordingSid } = recording;
    const twilioApiBase = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}`;
    const recordingUrl = `${twilioApiBase}/Recordings/${recordingSid}`;

    const reservationAttributes = attributes.reservation_attributes || {};

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
          ...attributes,
          reservation_attributes: {
            ...reservationAttributes,
            [reservationSid]: {
              media: [mediaObj],
            }
          },
        };
        break;
      case 'customer':
        newAttributes.conversations = {
          ...conversations,
          media: [mediaObj],
        };
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
  } else {
    return manager.workerClient?.reservations.has(reservationSid);
  }
};

export const waitForConferenceParticipants = (task: ITask): Promise<ConferenceParticipant[]> =>
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
      const { participants } = conference;
      if (Array.isArray(participants) && participants.length < 2) {
        return;
      }
      const worker = participants.find(
        (p) => p.participantType === 'worker' && p.isCurrentWorker
      );
      const customer = participants.find(
        (p) => p.participantType === 'customer'
      );

      if (!worker || !customer) {
        return;
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
        console.debug(
          `Customer participant didn't show up within ${
            maxWaitTimeMs / 1000
          } seconds`
        );
        
        if (waitForConferenceInterval) {
          clearInterval(waitForConferenceInterval);
          waitForConferenceInterval = null;
        }

        resolve([]);
      }
    }, maxWaitTimeMs);
  });
  
  export const waitForActiveCall = (task: ITask): Promise<string> =>
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
        
        const activeCall = manager.store.getState().flex.phone.activeCall;
        
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
          console.debug(
            `Call didn't activate within ${
              maxWaitTimeMs / 1000
            } seconds`
          );
          
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