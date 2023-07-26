import * as Flex from '@twilio/flex-ui';

import { FlexEvent } from '../../../../types/feature-loader';
import ActivityManager from '../../helper/ActivityManager';
import Activity from '../../../../types/task-router/Activity';

export const eventName = FlexEvent.workerActivityUpdated;
export const eventHook = async (_flex: typeof Flex, _manager: Flex.Manager, activity: Activity) => {
  console.log(`activity-reservation-handler: handle ${eventName} for ${activity.name}`);

  // workaround to deal with race condition between starting an outbound call
  // which sets the agents activity
  // and the worker activity updated handler which will immediately reset
  // if there is a pendinding activity but no tasks yet (pending task
  // takes a moment to appear)
  await new Promise((f) => setTimeout(f, 3000));

  // this will ensuer that if the supervisor changes
  // the agent state, if the agents client is active
  // it will promptly restore them to the correct state
  await ActivityManager.enforceEvaluatedState();
};
