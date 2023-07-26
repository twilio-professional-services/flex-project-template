import * as Flex from '@twilio/flex-ui';

import { FlexEvent } from '../../../../types/feature-loader';
import ActivityManager from '../../helper/ActivityManager';
import Activity from '../../../../types/task-router/Activity';

export const eventName = FlexEvent.workerActivityUpdated;
export const eventHook = async (_flex: typeof Flex, _manager: Flex.Manager, activity: Activity) => {
  console.log(`activity-reservation-handler: handle ${eventName} for ${activity.name}`);

  // This event is needed to handle activity changes by a supervisor, but it also
  // runs for local changes made by the worker or this feature. When we set activity
  // before starting an outbound call, there is a timing hole where this event will
  // be triggered before the outbound call task is delivered. When that happens,
  // enforceEvaluatedState will see no tasks and flip back to the pending activity.
  // Adding this timeout gives the task time to arrive before we call
  // enforceEvaluatedState.
  await new Promise((f) => setTimeout(f, 3000));

  // this will ensure that if the supervisor changes
  // the agent state, if the agents client is active
  // it will promptly restore them to the correct state
  await ActivityManager.enforceEvaluatedState();
};
