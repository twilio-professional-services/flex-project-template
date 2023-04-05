import * as Flex from '@twilio/flex-ui';

import FlexHelper from '../../helpers/flexHelper';
import WorkerActivity from '../../helpers/workerActivityHelper';
import { SystemActivityNames, wrapupActivity, wrapupNoAcdActivity } from '../../helpers/systemActivities';
import { FlexEvent } from '../../../../types/feature-loader';

export const eventName = FlexEvent.taskWrapup;
export const eventHook = (_flex: typeof Flex, _manager: Flex.Manager, task: Flex.ITask) => {
  console.log(`activity-handler: handle ${eventName} for ${task.sid}`);

  if (
    FlexHelper.hasActiveTask ||
    FlexHelper.hasPendingTask ||
    WorkerActivity.activityName === SystemActivityNames.wrapup
  ) {
    return;
  }

  const targetActivity = WorkerActivity.activity?.available ? wrapupActivity : wrapupNoAcdActivity;

  WorkerActivity.setWorkerActivity(targetActivity?.sid);
};
