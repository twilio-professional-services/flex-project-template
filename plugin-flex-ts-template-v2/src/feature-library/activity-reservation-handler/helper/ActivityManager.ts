import { Actions, Manager } from '@twilio/flex-ui';

import { getSystemActivityNames } from '../config';
import FlexHelper from '../../../utils/flex-helper';
import { CallbackPromise, PendingActivity } from '../types/ActivityManager';
import { updatePendingActivity } from '../flex-hooks/reducers/ActivityReservationHandler';

// collect the configured activity names from the configuration
const systemActivityNames = getSystemActivityNames();

// create a string array of these system names for
// comparison later exported for StartOutboundCall
export const reservedSystemActivities: string[] = [
  systemActivityNames.onATask,
  systemActivityNames.onATaskNoAcd,
  systemActivityNames.wrapup,
  systemActivityNames.wrapupNoAcd,
];

const isSystemActivity = (activityName: string): boolean => {
  return reservedSystemActivities.map((a) => a.toLowerCase()).includes(activityName.toLowerCase());
};

export const isWorkerCurrentlyInASystemActivity = async (): Promise<boolean> => {
  return isSystemActivity(await FlexHelper.getWorkerActivityName());
};

class ActivityManager {
  private pendingActivityChangeItemKey = `pendingActivityChange_${
    Manager.getInstance().serviceConfiguration.account_sid
  }`;

  private currentRequests: Array<CallbackPromise>;

  private runningRequests: number;

  private maxConcurrentRequests: number;

  constructor(maxConcurrentRequests = 1) {
    this.currentRequests = [];
    this.runningRequests = 0;
    this.maxConcurrentRequests = maxConcurrentRequests;

    const pendingActivity = this.#getPendingActivity();

    if (pendingActivity) {
      // Seed Redux with the saved pending activity if present
      Manager.getInstance().store.dispatch(updatePendingActivity(pendingActivity));
    }

    this.enforceEvaluatedState();
  }

  // expose method to cache an activity to change to
  storePendingActivityChange = (activityName: string) => {
    // Pulling out only the relevant activity properties to avoid
    // a circular structure error in JSON.stringify()
    const pendingActivityChange = {
      name: activityName,
    } as PendingActivity;

    localStorage.setItem(this.pendingActivityChangeItemKey, JSON.stringify(pendingActivityChange));
    Manager.getInstance().store.dispatch(updatePendingActivity(pendingActivityChange));
  };

  // exposed method to evaluate which state
  // we should be in and whether we should update it.
  // overrideAvailability is passed only when we want to
  // change the availability we are currently in. For example
  // when in a reserved system state but want to go unavailable
  // this method uses a semaphore to enforce a single execution
  // at a time.
  enforceEvaluatedState = async (available?: boolean) => {
    return new Promise(async (resolve, reject) => {
      this.currentRequests.push({
        resolve,
        reject,
        available,
      } as CallbackPromise);
      await this.#tryNext();
    });
  };

  // externally exposed for use in StartOutboundCall
  setWorkerActivity = async (activityName: string) => {
    if (activityName === this.#getPendingActivity()?.name) this.#clearPendingActivity();
    await Actions.invokeAction('SetActivity', {
      activityName,
      isInvokedByPlugin: true,
      options: {
        rejectPendingReservations: true,
      },
    });
  };

  #getPendingActivity = (): PendingActivity => {
    const item = localStorage.getItem(this.pendingActivityChangeItemKey);
    const pendingActivity: PendingActivity = item && JSON.parse(item);
    return pendingActivity;
  };

  #tryNext = async () => {
    if (!this.currentRequests.length) {
    } else if (this.runningRequests < this.maxConcurrentRequests) {
      const { resolve, reject, available } = this.currentRequests.shift() as CallbackPromise;
      this.runningRequests += 1;
      const req = this.#enforceEvaluatedState(available);
      req
        .then((res) => resolve(res))
        .catch((err) => reject(err))
        .finally(() => {
          this.runningRequests -= 1;
          this.#tryNext();
        });
    }
  };

  // performs the algorithm to evaluate whether we should switch Activity and
  // moves them if necessary
  #enforceEvaluatedState = async (availability?: boolean) => {
    const { available } = systemActivityNames;

    const currentWorkerActivity = await FlexHelper.getWorkerActivity();

    // when evaluating the next state, we need to know whether we want to be on or off acd
    // availability is used when manually selecting the activity from the agent drop down
    const acdAvailabilityStatus = availability === undefined ? currentWorkerActivity?.available || false : availability;

    // evaluate what the new activity/state should be
    const newActivity = await this.#evaluateNewState(acdAvailabilityStatus);

    // determine if we need to cache the state we are leaving
    // we only cache non reserved system states and evaluations that would
    // put is in a different state.
    const onSystemActivity = await isWorkerCurrentlyInASystemActivity();
    const currentActivity = currentWorkerActivity?.name || 'UNKNOWN';
    const isNewActivitySystemActivity = isSystemActivity(newActivity);

    // if leaving the current activity
    // and we are leaving a non-system activity for a system activity
    if (newActivity !== currentActivity && !onSystemActivity && isNewActivitySystemActivity)
      this.storePendingActivityChange(currentWorkerActivity?.name || available);

    // update the activity/state only if we are not currently in that activity/state.
    if (newActivity !== currentWorkerActivity?.name) await this.setWorkerActivity(newActivity);

    // if our final activity is not a system activity
    // we have no need for a pending state
    if (!isNewActivitySystemActivity) this.#clearPendingActivity();
  };

  // evaluates which state we should be in given an availability status
  #evaluateNewState = async (newAvailabilityStatus: boolean): Promise<string> => {
    const { available, onATask, onATaskNoAcd, wrapup, wrapupNoAcd } = systemActivityNames;

    const selectedTaskStatus = FlexHelper.getSelectedTaskStatus();
    const pendingActivity = this.#getPendingActivity();
    const isInSystemActivity = await isWorkerCurrentlyInASystemActivity();

    const hasPendingTasks = await FlexHelper.doesWorkerHaveReservationsInState(FlexHelper.RESERVATION_STATUS.PENDING);
    const hasAcceptedTasks = await FlexHelper.doesWorkerHaveReservationsInState(FlexHelper.RESERVATION_STATUS.ACCEPTED);
    const hasWrappingTasks = await FlexHelper.doesWorkerHaveReservationsInState(FlexHelper.RESERVATION_STATUS.WRAPPING);

    // flex won't let us change activity while on a pending task
    // other than to an offline activity which will reject the task
    // for this reason it is recommended to have auto accept configured
    // as part of the agent automation feature and take note that
    // selecting a task while a pending task is out there
    // will fail to switch to the appropriate "on a task" or "wrapup" state.
    if (hasPendingTasks && newAvailabilityStatus) return FlexHelper.getWorkerActivityName();
    if (hasPendingTasks && (await FlexHelper.doesWorkerHaveAPendingOutboundCall()))
      return FlexHelper.getWorkerActivityName();

    if (selectedTaskStatus === FlexHelper.RESERVATION_STATUS.ACCEPTED) {
      if (newAvailabilityStatus) return onATask;
      if (!newAvailabilityStatus) return onATaskNoAcd;
    } else if (selectedTaskStatus === FlexHelper.RESERVATION_STATUS.WRAPPING) {
      if (newAvailabilityStatus) return wrapup;
      if (!newAvailabilityStatus) return wrapupNoAcd;
    } else {
      // fallback behavior if no task is selected but
      // tasks are in flight
      if (hasAcceptedTasks && newAvailabilityStatus) return onATask;
      if (hasAcceptedTasks && !newAvailabilityStatus) return onATaskNoAcd;
      if (hasWrappingTasks && newAvailabilityStatus) return wrapup;
      if (hasWrappingTasks && !newAvailabilityStatus) return wrapupNoAcd;
      if (pendingActivity) return pendingActivity.name;
      if (!hasAcceptedTasks && !hasWrappingTasks && !hasPendingTasks && isInSystemActivity) return available;
    }

    // if none of the above is true, no state change necessary
    return FlexHelper.getWorkerActivityName();
  };

  #clearPendingActivity = (): void => {
    localStorage.removeItem(this.pendingActivityChangeItemKey);
    Manager.getInstance().store.dispatch(updatePendingActivity(null));
  };
}

const ActivityManagerSingleton = new ActivityManager();

export default ActivityManagerSingleton;
