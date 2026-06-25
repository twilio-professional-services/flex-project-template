import { ITask } from '@twilio/flex-ui';

import { getExcludedAttributes, getExcludedQueues } from '../config';
import { matchesAttribute } from '../../../utils/helpers';

export const canRecordTask = (task: ITask): boolean => {
  if (getExcludedQueues().findIndex((queue) => queue === task.queueName || queue === task.queueSid) >= 0) {
    return false;
  }

  for (const attribute of getExcludedAttributes()) {
    if (matchesAttribute(task.attributes, attribute.key, attribute.value)) {
      return false;
    }
  }

  return true;
};
