import * as Flex from '@twilio/flex-ui';

import TaskRouterService from '../../../utils/serverless/TaskRouter/TaskRouterService';
import HangUpByService from '../utils/HangUpByService';
import { HangUpBy } from '../enums/hangUpBy';

const instanceSid = Flex.Manager.getInstance().serviceConfiguration.flex_service_instance_sid;
const STORAGE_KEY = `hang_up_by_${instanceSid}`;

export const getHangUpBy = () => {
  const storageValue = localStorage.getItem(STORAGE_KEY);

  if (!storageValue) {
    return {};
  }

  const parsedValue = JSON.parse(storageValue);

  if (!parsedValue) {
    return {};
  }

  return parsedValue;
};

export const resetHangUpBy = () => {
  // remove all reservations from hang_up_by that are no longer assigned
  const storageValue = getHangUpBy();
  const newValue: any = {};

  const { tasks } = Flex.Manager.getInstance().store.getState().flex.worker;

  tasks.forEach((_value, key) => {
    if (storageValue[key]) {
      newValue[key] = storageValue[key];
    }
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(newValue));
};

export const hasExternalJoined = (task: Flex.ITask) => {
  if (task.conference) {
    const joinedExternals = task.conference.participants.filter(
      (p) => p.participantType !== 'customer' && p.participantType !== 'worker' && p.status === 'joined',
    );

    if (joinedExternals.length > 0) {
      return true;
    }
  }

  return false;
};

export const hasAnotherNonWorkerJoined = async (task: Flex.ITask) => {
  // Task passed to us from taskCompleted event may not have updated conference info
  const conference = Flex.Manager.getInstance().store.getState().flex.conferences.states.get(task.taskSid);

  if (conference && conference.source) {
    const otherNonWorkers = conference.source.participants.filter((p) => p.participantType !== 'worker');

    let joinedNonWorkers = false;

    for (const p of otherNonWorkers) {
      try {
        if (!p.callSid) {
          console.log('Unable to get participant from conference, missing participant sid');
          continue;
        }

        const response = await HangUpByService.fetchParticipant(conference.source.conferenceSid, p.callSid);

        if (response.participantsResponse && response.participantsResponse.status === 'connected') {
          joinedNonWorkers = true;
          break;
        }
      } catch (error) {
        console.log('Unable to get participant from conference, it probably ended', error);
      }
    }

    if (joinedNonWorkers === true) {
      return true;
    }
  }

  return false;
};

export const hasAnotherWorkerJoined = (task: Flex.ITask) => {
  // Task passed to us from taskCompleted event may not have updated conference info
  // But where we are called from that is actually desired

  if ((task.incomingTransferObject || task.outgoingTransferObject) && task.conference) {
    const otherJoinedWorkers = task.conference.participants.filter(
      (p) => p.participantType === 'worker' && !p.isCurrentWorker && p.status === 'joined',
    );

    if (otherJoinedWorkers.length > 0) {
      return true;
    }
  }

  return false;
};

export const hasCustomerJoined = async (task: Flex.ITask) => {
  // Task passed to us from taskCompleted event may not have updated conference info
  const conference = Flex.Manager.getInstance().store.getState().flex.conferences.states.get(task.taskSid);

  if (conference && conference.source) {
    const customers = conference.source.participants.filter((p) => p.participantType === 'customer');

    let joinedCustomers = false;

    for (const p of customers) {
      try {
        if (!p.callSid) {
          console.log('Unable to get participant from conference, missing participant sid');
          continue;
        }

        const response = await HangUpByService.fetchParticipant(conference.source.conferenceSid, p.callSid);

        if (response.participantsResponse && response.participantsResponse.status === 'connected') {
          joinedCustomers = true;
          break;
        }
      } catch (error) {
        console.log('Unable to get participant from conference, it probably ended', error);
      }
    }

    if (joinedCustomers === true) {
      return true;
    }
  }

  return false;
};

export const setHangUpBy = (reservationSid: string, value: HangUpBy) => {
  const existingValue = getHangUpBy();

  const newValue = {
    ...existingValue,
    [reservationSid]: value,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(newValue));
  console.log(`Set ${STORAGE_KEY} for ${reservationSid} to ${value}`, newValue);
};

export const setHangUpByAttribute = async (
  taskSid: string,
  taskAttributes: any,
  value: string,
  destination?: string,
) => {
  if (
    taskAttributes &&
    taskAttributes.conversations &&
    taskAttributes.conversations.hang_up_by === value &&
    (!destination || taskAttributes.conversations.destination === destination)
  ) {
    // no change!
    return;
  }

  if (taskAttributes && !taskAttributes.conference) {
    // no conference? no call! this functionality is call-specific, so return.
    return;
  }

  const newAttributes = {
    conversations: {
      hang_up_by: value,
      destination: null as string | null,
    },
  };

  if (destination) {
    newAttributes.conversations.destination = destination;
  }

  try {
    await TaskRouterService.updateTaskAttributes(taskSid, newAttributes);
  } catch (error) {
    console.log(`Failed to set hang_up_by attribute for ${taskSid} to ${value}`, error);
  }
  console.log(`Set hang_up_by attribute for ${taskSid} to ${value}`, newAttributes);
};

export const clearHangUpBy = (reservationSid: string) => {
  const storage = getHangUpBy();

  if (storage[reservationSid]) {
    delete storage[reservationSid];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
    console.log(`Removed ${STORAGE_KEY} value for ${reservationSid}`);
  }
};
