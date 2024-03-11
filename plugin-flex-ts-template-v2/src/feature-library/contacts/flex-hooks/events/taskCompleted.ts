import * as Flex from '@twilio/flex-ui';

import { FlexEvent } from '../../../../types/feature-loader';
import contactsUtil from '../../utils/ContactsUtil';
import { isRecentsEnabled } from '../../config';

export const eventName = FlexEvent.taskCompleted;
export const eventHook = async (_flex: typeof Flex, _manager: Flex.Manager, task: Flex.ITask) => {
  if (isRecentsEnabled()) {
    contactsUtil.addHistoricalContact(task);
  }
};
