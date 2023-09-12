import { ITask, Manager } from '@twilio/flex-ui';

const manager = Manager.getInstance();

export const isWorkerUsingWebRTC = (): boolean => {
  return manager.workerClient?.attributes?.contact_uri.startsWith('client:');
};

export const getLocalParticipantForTask = (task: ITask) => {
  return task.attributes?.conference?.participants?.worker;
};
