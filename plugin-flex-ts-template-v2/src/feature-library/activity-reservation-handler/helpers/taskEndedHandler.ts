import * as Flex from '@twilio/flex-ui';

import FlexHelper from './flexHelper';
import WorkerActivity from './workerActivityHelper';
import { systemActivities, availableActivity } from './systemActivities';
import { getPendingActivity } from './pendingActivity';
import { FlexEvent } from '../../../types/feature-loader';
import { isFeatureEnabled } from '../config';

const taskEndedHandler = (task: Flex.ITask, flexEvent: FlexEvent) => {
  if (!isFeatureEnabled()) return;

  console.log(`activity-handler: handle ${flexEvent} for ${task.sid}`);

  const pendingActivity = getPendingActivity();

  if (
    flexEvent === FlexEvent.taskTimeout ||
    FlexHelper.activeTaskCount > 1 ||
    FlexHelper.hasWrappingTask ||
    WorkerActivity.activitySid === pendingActivity?.sid
  ) {
    return;
  }

  if (pendingActivity) {
    console.debug('handleReservationEnded, Setting worker to pending activity', pendingActivity.name);
    WorkerActivity.setWorkerActivity(pendingActivity.sid, true);
  } else if (
    systemActivities.map((a) => a.toLowerCase()).includes((WorkerActivity.activityName as string).toLowerCase())
  ) {
    console.debug(
      'handleReservationEnded, No pending activity and current activity ' +
        `"${WorkerActivity.activityName}" is a system activity. Setting worker to ` +
        'default activity:',
      availableActivity?.name,
    );
    WorkerActivity.setWorkerActivity(availableActivity?.sid);
  }
};

export default taskEndedHandler;
