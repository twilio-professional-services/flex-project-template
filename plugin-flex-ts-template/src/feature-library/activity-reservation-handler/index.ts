import { Notifications, Manager } from '@twilio/flex-ui';
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
import { handleNewReservation } from './flex-hooks/jsclient-event-listeners/worker-client/reservationEventListeners';
import { storePendingActivityChange, getPendingActivity, clearPendingActivityChange } from './helpers/pendingActivity';

const manager = Manager.getInstance();

export const delayActivityChange = (activity: any) => {
  Notifications.showNotification(NotificationIds.ActivityChangeDelayed, {
    activityName: activity.name,
  });

  storePendingActivityChange(activity, true);
};

const validateAndSetWorkerActivity = () => {
  console.debug('otherFlexSessionDetected:', FlexHelper.otherSessionDetected);

  if (FlexHelper.otherSessionDetected) {
    console.warn('Another flex session was detected. ' + 'Not validating or resetting worker activity');

    return;
  }

  const pendingActivity = getPendingActivity();
  const { activitySid: workerActivitySid, activityName: workerActivityName } = WorkerActivity;

  if (!FlexHelper.hasLiveCallTask && FlexHelper.hasWrappingTask) {
    const targetActivity = pendingActivity?.available ? wrapupActivity : wrapupNoAcdActivity;

    console.log(`Resetting "${targetActivity?.name}" Activity from:`, workerActivityName);

    WorkerActivity.setWorkerActivity(targetActivity?.sid);
  } else if (
    (workerActivitySid === wrapupActivity?.sid || workerActivitySid === wrapupNoAcdActivity?.sid) &&
    !FlexHelper.hasWrappingTask
  ) {
    const targetActivity = pendingActivity ? pendingActivity : availableActivity;

    console.log(
      `Setting worker from "${workerActivityName}" to ` + `${pendingActivity ? 'pending' : 'default'} activity:`,
      targetActivity?.name,
    );

    WorkerActivity.setWorkerActivity(targetActivity?.sid, pendingActivity ? true : false);
  } else if (
    (workerActivitySid === onTaskActivity?.sid || workerActivitySid === onTaskNoAcdActivity?.sid) &&
    !FlexHelper.hasActiveTask
  ) {
    const targetActivity = pendingActivity ? pendingActivity : availableActivity;

    console.log(
      `Setting worker from "${workerActivityName}" to ` + `${pendingActivity ? 'pending' : 'default'} activity:`,
      targetActivity?.name,
    );

    WorkerActivity.setWorkerActivity(targetActivity?.sid, pendingActivity ? true : false);
  } else if (workerActivitySid === FlexHelper.offlineActivitySid && !FlexHelper.hasWrappingTask) {
    clearPendingActivityChange();
  }
};

manager.events.addListener('pluginsLoaded', () => {
  initialize();
  FlexHelper.initialize();
});

export const initialize = () => {
  validateAndSetWorkerActivity();

  for (const reservation of FlexHelper.workerTasks.values()) {
    handleNewReservation(reservation);
  }
};
