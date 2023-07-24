import * as Flex from '@twilio/flex-ui';

import { FlexEvent } from '../../../../types/feature-loader';
import ActivityManager from '../../helper/ActivityManager';
import Activity from '../../../../types/task-router/Activity';

export const eventName = FlexEvent.workerActivityUpdated;
export const eventHook = async (_flex: typeof Flex, _manager: Flex.Manager, activity: Activity) => {
  console.log(`activity-reservation-handler: handle ${eventName} for ${activity.name}`);

  await ActivityManager.updateState();
};
