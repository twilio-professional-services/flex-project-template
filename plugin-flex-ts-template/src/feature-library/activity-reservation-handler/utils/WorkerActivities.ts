import  {Actions, Notifications, Manager} from '@twilio/flex-ui';
import FlexHelper from '../helpers/flexHelper';
import WorkerActivity from '../helpers/workerActivityHelper';
import { NotificationIds } from '../flex-hooks/notifications/ActivityReservationHandler'
import { SystemActivityNames, systemActivities } from '../helpers/systemActivities';

const ReservationEvents = {
  accepted: 'accepted',
  rejected: 'rejected',
  timeout: 'timeout',
  canceled: 'canceled',
  rescinded: 'rescinded',
  completed: 'completed',
  wrapup: 'wrapup'
};


const manager = Manager.getInstance();
const reservationListeners = new Map();

export const availableActivity = FlexHelper.getActivityByName(SystemActivityNames.available);
// Update 'Activity.onATask' value to match the activity name you're
// using to indicate an agent has an active task
export const onTaskActivity = FlexHelper.getActivityByName(SystemActivityNames.onATask);
// Update 'Activity.onATaskNoAcd' value to match the activity name you're
// using to indicate an agent's tasks are on an outbound task started from
// a non-Available activity
export const onTaskNoAcdActivity = FlexHelper.getActivityByName(SystemActivityNames.onATaskNoAcd);
// Update 'Activity.wrapup' value to match the activity name you're
// using to indicate an agent's tasks are in wrapup status
export const wrapupActivity = FlexHelper.getActivityByName(SystemActivityNames.wrapup);
// Update 'Activity.wrapupNoAcd' value to match the activity name you're
// using to indicate an agent's tasks are in wrapup status when they started
// the first task (outbound cal) from a non-Available activity
export const wrapupNoAcdActivity = FlexHelper.getActivityByName(SystemActivityNames.wrapupNoAcd);


//#region Supporting functions
export const shouldStoreCurrentActivitySid = () => {
  return !systemActivities.map((a) => a.toLowerCase()).includes(WorkerActivity.activityName.toLowerCase());
};

export const storeCurrentActivitySidIfNeeded = () => {
  if (shouldStoreCurrentActivitySid()) {
    const { activity: workerActivity } = WorkerActivity;

    console.debug('Storing current activity as pending activity:', workerActivity.name);
    FlexHelper.storePendingActivityChange(WorkerActivity.activity);
  }
};

export const canChangeWorkerActivity = (targetActivitySid: any) => {
  let canChange = true;

  // TaskRouter will not allow a worker to change from an available activity
  // to any other activity if the worker has a pending reservation without
  //  rejecting that reservation, which isn't what we want to do in this use case
  if (FlexHelper.isAnAvailableActivityBySid(targetActivitySid) && FlexHelper.hasPendingTask) {
    canChange = false;
  }

  return canChange;
};

export const setWorkerActivity = (newActivitySid?: any, clearPendingActivity?: any) => {
  try {
    const targetActivity = FlexHelper.getActivityBySid(newActivitySid);
    console.log('FlexState', FlexHelper);
    console.log('targetActivity', targetActivity);
    console.log('newActivitySid', newActivitySid);
    if (!canChangeWorkerActivity(newActivitySid)) {
      console.debug(
        'setWorkerActivity: Not permitted to change worker activity at this time. ' + 'Target activity:',
        targetActivity?.name,
      );
      return;
    }
    if (WorkerActivity.activitySid === newActivitySid) {
      console.debug(`setWorkerActivity: Worker already in activity "${targetActivity?.name}". No change needed.`);
    } else {
      console.log('setWorkerActivity: ', targetActivity?.name);
      Actions.invokeAction('SetActivity', {
        activitySid: newActivitySid,
        isInvokedByPlugin: true,
      });
    }
    if (clearPendingActivity) {
      FlexHelper.clearPendingActivityChange();
    }
  } catch (error) {
    console.error('setWorkerActivity: Error setting worker activity SID', error);
  }
};

export const delayActivityChange = (activity: any) => {
  Notifications.showNotification(NotificationIds.ActivityChangeDelayed, {
    activityName: activity.name,
  });

  FlexHelper.storePendingActivityChange(activity, true);
};

const validateAndSetWorkerActivity = () => {
  console.debug('otherFlexSessionDetected:', FlexHelper.otherSessionDetected);

  if (FlexHelper.otherSessionDetected) {
    console.warn('Another flex session was detected. ' + 'Not validating or resetting worker activity');

    return;
  }

  const pendingActivity = FlexHelper.pendingActivity;
  const { activitySid: workerActivitySid, activityName: workerActivityName } = WorkerActivity;

  if (!FlexHelper.hasLiveCallTask && FlexHelper.hasWrappingTask) {
    const targetActivity = pendingActivity?.available ? wrapupActivity : wrapupNoAcdActivity;

    console.log(`Resetting "${targetActivity.name}" Activity from:`, workerActivityName);

    setWorkerActivity(targetActivity?.sid);
  } else if (
    (workerActivitySid === wrapupActivity?.sid || workerActivitySid === wrapupNoAcdActivity?.sid) &&
    !FlexHelper.hasWrappingTask
  ) {
    const targetActivity = pendingActivity ? pendingActivity : availableActivity;

    console.log(
      `Setting worker from "${workerActivityName}" to ` + `${pendingActivity ? 'pending' : 'default'} activity:`,
      targetActivity?.name,
    );

    setWorkerActivity(targetActivity?.sid, pendingActivity ? true : false);
  } else if (
    (workerActivitySid === onTaskActivity?.sid || workerActivitySid === onTaskNoAcdActivity?.sid) &&
    !FlexHelper.hasActiveTask
  ) {
    const targetActivity = pendingActivity ? pendingActivity : availableActivity;

    console.log(
      `Setting worker from "${workerActivityName}" to ` + `${pendingActivity ? 'pending' : 'default'} activity:`,
      targetActivity?.name,
    );

    setWorkerActivity(targetActivity?.sid, pendingActivity ? true : false);
  } else if (workerActivitySid === FlexHelper.offlineActivitySid && !FlexHelper.hasWrappingTask) {
    FlexHelper.clearPendingActivityChange();
  }
};
//#endregion Supporting functions

//#region Reservation listeners and handlers
const stopReservationListeners = (reservation: any) => {
  const listeners = reservationListeners.get(reservation);
  if (listeners) {
    listeners.forEach((listener: any) => {
      reservation.removeListener(listener.event, listener.callback);
    });
    reservationListeners.delete(reservation);
  }
};

const handleReservationAccept = async (reservation: any) => {
  console.log(`### handleReservationAccept ${reservation.sid}`);

  storeCurrentActivitySidIfNeeded();

  const targetActivity = WorkerActivity.activity.available ? onTaskActivity : onTaskNoAcdActivity;

  setWorkerActivity(targetActivity?.sid);
};

const handleReservationWrapup = async (reservation: any) => {
  console.log(`handleReservationWrapup: `, reservation);

  if (FlexHelper.hasLiveCallTask || FlexHelper.hasPendingTask || WorkerActivity.activityName === SystemActivityNames.wrapup) {
    return;
  }

  const targetActivity = WorkerActivity.activity.available ? wrapupActivity : wrapupNoAcdActivity;

  setWorkerActivity(targetActivity?.sid);
};

const handleReservationEnded = async (reservation: any, eventType?: any) => {
  console.log(`handleReservationEnded: `, reservation);

  const pendingActivity = FlexHelper.pendingActivity;

  if (
    eventType === ReservationEvents.timeout ||
    FlexHelper.hasActiveCallTask ||
    FlexHelper.hasWrappingTask ||
    WorkerActivity.activitySid === pendingActivity?.sid
  ) {
    return;
  }

  if (pendingActivity) {
    console.debug('handleReservationEnded, Setting worker to pending activity', pendingActivity.name);
    setWorkerActivity(pendingActivity.sid, true);
  } else if( systemActivities.map((a) => a.toLowerCase()).includes(WorkerActivity.activityName.toLowerCase())) {
    console.debug(
      'handleReservationEnded, No pending activity and current activity ' +
        `"${WorkerActivity.activityName}" is a system activity. Setting worker to ` +
        'default activity:',
      availableActivity?.name,
    );
    setWorkerActivity(availableActivity?.sid);
  }
};
    
const handleReservationUpdated = (event: any, reservation: any) => {
  console.debug('Event, reservation updated', event, reservation);
  switch (event) {
    case ReservationEvents.accepted: {
      handleReservationAccept(reservation);
      break;
    }
    case ReservationEvents.wrapup: {
      handleReservationWrapup(reservation);
      break;
    }
    case ReservationEvents.timeout: {
      handleReservationEnded(reservation, ReservationEvents.timeout);
      stopReservationListeners(reservation);
      break;
    }
    case ReservationEvents.completed:
    case ReservationEvents.rejected:
    case ReservationEvents.canceled:
    case ReservationEvents.rescinded: {
      handleReservationEnded(reservation);
      stopReservationListeners(reservation);
      break;
    }
    default:
    // Nothing to do here
  }
};

const initReservationListeners = (reservation: any) => {
  const trueReservation = reservation.addListener ? reservation : reservation.source;
  stopReservationListeners(trueReservation);
  const listeners: any = [];
  Object.values(ReservationEvents).forEach((event) => {
    const callback = () => handleReservationUpdated(event, trueReservation);
    trueReservation.addListener(event, callback);
    listeners.push({ event, callback });
  });
  reservationListeners.set(trueReservation, listeners);
};

const handleNewReservation = (reservation: any) => {
  console.debug('new reservation', reservation);
  initReservationListeners(reservation);
};

export const handleReservationCreated = async (reservation: any) => {
  handleNewReservation(reservation);

  storeCurrentActivitySidIfNeeded();
};
//#endregion Reservation listeners and handlers

//#region Manager event listeners and handlers
manager.events.addListener('pluginsLoaded', () => {
  initialize();
  FlexHelper.initialize();
});
//#endregion Manager event listeners and handlers

export const initialize = () => {
  validateAndSetWorkerActivity();

  for (const reservation of FlexHelper.workerTasks.values()) {
    handleNewReservation(reservation);
  }
};
