import { storeCurrentActivitySidIfNeeded, getPendingActivity } from '../../../helpers/pendingActivity';
import WorkerActivity from '../../../helpers/workerActivityHelper';
import FlexHelper from '../../../helpers/flexHelper';
import {
  onTaskActivity,
  onTaskNoAcdActivity,
  wrapupActivity,
  wrapupNoAcdActivity,
  availableActivity,
} from '../../../helpers/systemActivities';
import { SystemActivityNames, systemActivities } from '../../../helpers/systemActivities';

const ReservationEvents = {
  accepted: 'accepted',
  rejected: 'rejected',
  timeout: 'timeout',
  canceled: 'canceled',
  rescinded: 'rescinded',
  completed: 'completed',
  wrapup: 'wrapup',
};

const reservationListeners = new Map();

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

  WorkerActivity.setWorkerActivity(targetActivity?.sid);
};

const handleReservationWrapup = async (reservation: any) => {
  console.log(`handleReservationWrapup: `, reservation);

  if (
    FlexHelper.hasLiveCallTask ||
    FlexHelper.hasPendingTask ||
    WorkerActivity.activityName === SystemActivityNames.wrapup
  ) {
    return;
  }

  const targetActivity = WorkerActivity.activity.available ? wrapupActivity : wrapupNoAcdActivity;

  WorkerActivity.setWorkerActivity(targetActivity?.sid);
};

const handleReservationEnded = async (reservation: any, eventType?: any) => {
  console.log(`handleReservationEnded: `, reservation);

  const pendingActivity = getPendingActivity();

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
    WorkerActivity.setWorkerActivity(pendingActivity.sid, true);
  } else if (systemActivities.map((a) => a.toLowerCase()).includes(WorkerActivity.activityName.toLowerCase())) {
    console.debug(
      'handleReservationEnded, No pending activity and current activity ' +
        `"${WorkerActivity.activityName}" is a system activity. Setting worker to ` +
        'default activity:',
      availableActivity?.name,
    );
    WorkerActivity.setWorkerActivity(availableActivity?.sid);
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

export const handleNewReservation = (reservation: any) => {
  console.debug('new reservation', reservation);
  initReservationListeners(reservation);
};

export const handleReservationCreated = async (reservation: any) => {
  handleNewReservation(reservation);

  storeCurrentActivitySidIfNeeded();
};
