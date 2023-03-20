import { ITask, Manager, WorkerAttributes } from '@twilio/flex-ui';
import { Worker as InstantQueryWorker } from 'types/sync/InstantQuery';

export const isInternalCall = (task: ITask) => task.attributes.client_call === true;

export const makeInternalCall = (manager: Manager, selectedWorker: InstantQueryWorker) => {
  const { workflow_sid, queue_sid } = manager.serviceConfiguration.outbound_call_flows.default;

  if (!manager.workerClient) {
    return;
  }

  const { name: fromName } = manager.workerClient;

  const { contact_uri: from_uri, full_name: fromFullName } = manager.workerClient.attributes as WorkerAttributes;

  const {
    attributes: { full_name, contact_uri: target_uri },
    friendly_name,
  } = selectedWorker;

  manager.workerClient.createTask(target_uri, from_uri, workflow_sid, queue_sid, {
    attributes: {
      to: target_uri,
      direction: 'outbound',
      name: full_name || friendly_name,
      fromName: fromFullName || fromName,
      targetWorker: from_uri,
      autoAnswer: 'true',
      client_call: true,
    },
    taskChannelUniqueName: 'voice',
  });
};
