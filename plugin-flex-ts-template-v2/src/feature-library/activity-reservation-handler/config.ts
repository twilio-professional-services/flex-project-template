import { Notifications } from '@twilio/flex-ui';

import FlexHelper from './helpers/flexHelper';
import WorkerActivity from './helpers/workerActivityHelper';
import { NotificationIds } from './flex-hooks/notifications/ActivityReservationHandler';
import {
  onTaskActivity,
  onTaskNoAcdActivity,
  wrapupActivity,
  wrapupNoAcdActivity,
  availableActivity,
} from './helpers/systemActivities';
import { storePendingActivityChange, getPendingActivity, clearPendingActivityChange } from './helpers/pendingActivity';
import { getFeatureFlags } from '../../utils/configuration';
import ActivityReservationHandlerConfig from './types/ServiceConfiguration';

const { enabled = false, system_activity_names } =
  (getFeatureFlags()?.features?.activity_reservation_handler as ActivityReservationHandlerConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const getSystemActivityNames = () => {
  return system_activity_names;
};

export const delayActivityChange = (activity: any) => {
  Notifications.showNotification(NotificationIds.ActivityChangeDelayed, {
    activityName: activity.name,
  });

  storePendingActivityChange(activity, true);
};

const validateAndSetWorkerActivity = () => {
  console.debug('otherFlexSessionDetected:', FlexHelper.otherSessionDetected);

  if (FlexHelper.otherSessionDetected) {
    console.warn('Another flex session was detected. Not validating or resetting worker activity');

    return;
  }

  const pendingActivity = getPendingActivity();
  const { activitySid: workerActivitySid, activityName: workerActivityName } = WorkerActivity;

  if (!FlexHelper.hasLiveCallTask && FlexHelper.hasWrappingTask) {
    const targetActivity = pendingActivity?.available ? wrapupActivity : wrapupNoAcdActivity;

    console.log(`Resetting "${targetActivity?.name}" Activity from:`, workerActivityName);

    WorkerActivity.setWorkerActivity(targetActivity?.sid);
    return;
  }

  if (
    ((workerActivitySid === wrapupActivity?.sid || workerActivitySid === wrapupNoAcdActivity?.sid) &&
      !FlexHelper.hasWrappingTask) ||
    ((workerActivitySid === onTaskActivity?.sid || workerActivitySid === onTaskNoAcdActivity?.sid) &&
      !FlexHelper.hasActiveTask)
  ) {
    const targetActivity = pendingActivity ? pendingActivity : availableActivity;

    console.log(
      `Setting worker from "${workerActivityName}" to ${pendingActivity ? 'pending' : 'default'} activity:`,
      targetActivity?.name,
    );

    WorkerActivity.setWorkerActivity(targetActivity?.sid, Boolean(pendingActivity));
    return;
  }

  if (workerActivitySid === FlexHelper.offlineActivitySid && !FlexHelper.hasWrappingTask) {
    clearPendingActivityChange();
  }
};

export const initialize = () => {
  FlexHelper.initialize();
  validateAndSetWorkerActivity();
};
