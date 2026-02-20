import { Manager, WorkerAttributes, IQueue, Actions } from '@twilio/flex-ui';
import { v4 as uuidv4 } from 'uuid';

import { Worker as InstantQueryWorker } from '../../../types/sync/InstantQuery';
import { getApplicationSid, getOutboundQueueSid } from '../config';

export const makeInternalCall = async (manager: Manager, selectedWorker: InstantQueryWorker) => {
  if (!manager.workerClient) {
    return;
  }

  const { name: fromName } = manager.workerClient;
  const { full_name: fromFullName } = manager.workerClient.attributes as WorkerAttributes;
  const {
    attributes: { full_name },
    friendly_name,
    worker_sid,
  } = selectedWorker;
  const conversation_id = uuidv4();
  const from = fromFullName || fromName;

  Actions.invokeAction('StartOutboundCall', {
    destination: `app:${getApplicationSid()}?worker_sid=${worker_sid}&from=${from}&conversation_id=${conversation_id}`,
    queueSid: getOutboundQueueSid(),
    taskAttributes: {
      name: full_name || friendly_name,
      internal_outbound_to: full_name || friendly_name,
      conversations: {
        conversation_id,
      },
    },
  });
};

export const makeInternalCallToQueue = (manager: Manager, selectedQueue: IQueue) => {
  if (!manager.workerClient) {
    return;
  }

  const { name: fromName } = manager.workerClient;
  const { full_name: fromFullName } = manager.workerClient.attributes as WorkerAttributes;
  const conversation_id = uuidv4();
  const from = fromFullName || fromName;

  Actions.invokeAction('StartOutboundCall', {
    destination: `app:${getApplicationSid()}?callToQueue=${
      selectedQueue.name
    }&from=${from}&conversation_id=${conversation_id}`,
    queueSid: getOutboundQueueSid(),
    taskAttributes: {
      name: selectedQueue.name,
      internal_outbound_to: selectedQueue.name,
      conversations: {
        conversation_id,
      },
    },
  });
};
