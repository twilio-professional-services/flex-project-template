import * as Flex from '@twilio/flex-ui';

import WorkerActivity from '../../helpers/workerActivityHelper';
import { storeCurrentActivitySidIfNeeded } from '../../helpers/pendingActivity';
import { onTaskActivity, onTaskNoAcdActivity } from '../../helpers/systemActivities';
import { FlexEvent } from '../../../../types/feature-loader';

export const eventName = FlexEvent.taskAccepted;
export const eventHook = (_flex: typeof Flex, _manager: Flex.Manager, task: Flex.ITask) => {
  console.log(`activity-handler: handle ${eventName} for ${task.sid}`);

  storeCurrentActivitySidIfNeeded();

  const targetActivity = WorkerActivity.activity?.available ? onTaskActivity : onTaskNoAcdActivity;

  WorkerActivity.setWorkerActivity(targetActivity?.sid);
};
