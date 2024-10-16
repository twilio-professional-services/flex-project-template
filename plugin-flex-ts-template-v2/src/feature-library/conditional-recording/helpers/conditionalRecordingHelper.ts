import { ITask } from '@twilio/flex-ui';

import { getExcludedAttributes, getExcludedQueues } from '../config';

export const canRecordTask = (task: ITask): boolean => {
  if (getExcludedQueues().findIndex((queue) => queue === task.queueName || queue === task.queueSid) >= 0) {
    return false;
  }

  for (const attribute of getExcludedAttributes()) {
    if (task.attributes[attribute.key] === attribute.value) {
      return false;
    }
  }

  return true;
};
