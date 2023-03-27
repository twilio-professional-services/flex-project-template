import * as Flex from '@twilio/flex-ui';

import { storeCurrentActivitySidIfNeeded } from '../../helpers/pendingActivity';
import { FlexEvent } from '../../../../types/feature-loader';

export const eventName = FlexEvent.taskReceived;
export const eventHook = (_flex: typeof Flex, _manager: Flex.Manager, task: Flex.ITask) => {
  console.log(`activity-handler: handle ${eventName} for ${task.sid}`);

  storeCurrentActivitySidIfNeeded();
};
