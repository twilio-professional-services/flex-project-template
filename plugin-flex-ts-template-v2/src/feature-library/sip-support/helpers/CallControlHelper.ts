import { ITask, Manager } from '@twilio/flex-ui';

import { CustomWorkerAttributes } from '../../../types/task-router/Worker';

const manager = Manager.getInstance();

export const isWorkerUsingWebRTC = (): boolean => {
  return (manager.workerClient?.attributes as CustomWorkerAttributes)?.contact_uri.startsWith('client:');
};

export const getLocalParticipantForTask = (task: ITask) => {
  return task.attributes?.conference?.participants?.worker;
};
