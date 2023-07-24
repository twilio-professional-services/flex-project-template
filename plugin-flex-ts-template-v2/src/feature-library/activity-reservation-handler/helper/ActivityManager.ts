import { Actions, Manager, TaskHelper } from '@twilio/flex-ui';

import { getSystemActivityNames } from '../config';
import Activity from '../../../types/task-router/Activity';

// collect the configured activity names from the configuration
const systemActivityNames = getSystemActivityNames();

// create a string array of these system names for
// comparison later
export const rerservedSystemActivities: string[] = [
  systemActivityNames.onATask,
  systemActivityNames.onATaskNoAcd,
  systemActivityNames.wrapup,
  systemActivityNames.wrapupNoAcd,
];

const UNKNOWN_ACTIVITY = 'unknown';
const TASK_STATUS_ACCEPTED = 'accepted';
const TASK_STATUS_WRAPPING = 'wrapping';

// some helper functions for readability later
const manager = Manager.getInstance();
const getflexState = () => {
  return manager.store.getState().flex;
};

const workerActivities = (getflexState().worker?.activities || new Map()) as Map<string, Activity>;

// exporting to be used by SetActivity
export const getActivityByName = (activityName: string): Activity | undefined => {
  const activities = [...workerActivities.values()];
  return activities.find((a) => a?.name?.toLowerCase() === activityName.toLowerCase());
};

const getWorkerTasks = () => {
  return getflexState().worker.tasks;
};

// exporting to be used by SetActivity
export const hasAcceptedTasks = (): boolean => {
  if (!getWorkerTasks()) return false;
  return [...getWorkerTasks().values()].some((task) => task.status === TASK_STATUS_ACCEPTED);
};

// exporting to be used by SetActivity
export const hasWrappingTasks = (): boolean => {
  if (!getWorkerTasks()) return false;
  return [...getWorkerTasks().values()].some((task) => task.status === TASK_STATUS_WRAPPING);
};
const getSelectedTaskSid = (): string | undefined => {
  return getflexState().view.selectedTaskSid;
};
const getSelectedTaskStatus = (): string | undefined => {
  const taskSid = getSelectedTaskSid();
  if (taskSid) return TaskHelper.getTaskByTaskSid(taskSid).status;
  return undefined;
};

const workerClient = manager.workerClient;

// exporting to be used by StartOutboundCall
export const getCurrentWorkerActivity = (): Activity | undefined => {
  return workerClient?.activity;
};
const getCurrentWorkerActivityName = (): string => {
  return getCurrentWorkerActivity()?.name || UNKNOWN_ACTIVITY;
};
export const isCurrentlyInASystemActivity = (): boolean => {
  return rerservedSystemActivities.map((a) => a.toLowerCase()).includes(getCurrentWorkerActivityName().toLowerCase());
};

interface PendingActivity {
  name: string;
}

interface FunctionPromise {
  resolve: any;
  reject: any;
  overrideAvailability: boolean;
}

class ActivityManager {
  private pendingActivityChangeItemKey = `pendingActivityChange_${manager.serviceConfiguration.account_sid}`;

  private currentRequests: Array<FunctionPromise>;

  private runningRequests: number;

  private maxConcurrentRequests: number;

  constructor(maxConcurrentRequests = 1) {
    this.currentRequests = [];
    this.runningRequests = 0;
    this.maxConcurrentRequests = maxConcurrentRequests;
    this.updateState();
  }

  // expose method to cache an activity to change to
  storePendingActivityChange = (activity: string) => {
    // Pulling out only the relevant activity properties to avoid
    // a circular structure error in JSON.stringify()
    const pendingActivityChange = {
      name: activity,
    } as PendingActivity;

    localStorage.setItem(this.pendingActivityChangeItemKey, JSON.stringify(pendingActivityChange));
  };

  // externally exposed method to evaluate which state
  // we should be in and whether we should update it.
  // overrideAvailability is passed only when we want to
  // change the availability we are currently in. For example
  // when in a reserved system state but want to go unavailable
  // this method uses a semaphore to enforce a single execution
  // at a time.
  updateState = async (overrideAvailability?: boolean) => {
    return new Promise(async (resolve, reject) => {
      this.currentRequests.push({
        resolve,
        reject,
        overrideAvailability,
      } as FunctionPromise);
      await this.#tryNext();
    });
  };

  // externally exposed method to change the worker state
  // was only exposed for use in StartOutboundCall
  setWorkerActivity = async (activityName: string) => {
    if (activityName === this.getPendingActivity()?.name) this.#clearPendingActivity();
    Actions.invokeAction('SetActivity', {
      activityName,
      isInvokedByPlugin: true,
    });

    await this.#waitForWorkerActivityChange(activityName);
  };

  // externally exposed method to provide the cached activity
  // was only exposed for PendingActivityComponent
  getPendingActivity = (): PendingActivity => {
    const item = localStorage.getItem(this.pendingActivityChangeItemKey);
    const pendingActivity: PendingActivity = item && JSON.parse(item);
    return pendingActivity;
  };

  #tryNext = async () => {
    if (!this.currentRequests.length) {
    } else if (this.runningRequests < this.maxConcurrentRequests) {
      const { resolve, reject, overrideAvailability } = this.currentRequests.shift() as FunctionPromise;
      this.runningRequests += 1;
      const req = this.#updateState(overrideAvailability);
      req
        .then((res) => resolve(res))
        .catch((err) => reject(err))
        .finally(() => {
          this.runningRequests -= 1;
          this.#tryNext();
        });
    }
  };

  // performs the algorithm to evaluate whether we should switch state
  #updateState = async (overrideAvailability?: boolean) => {
    const { available } = systemActivityNames;

    const currentWorkerActivity = getCurrentWorkerActivity();

    // when evaluating the next state, we need to know whether we want to be on or off acd
    // overrideAvailability is used when manually selecting the activity from the agent drop down
    const acdAvailabilityStatus =
      overrideAvailability === undefined ? currentWorkerActivity?.available || false : overrideAvailability;

    // evaluate what the new activity/state should be
    const newActivity = this.#evaluateNewState(acdAvailabilityStatus);

    // determine if we need to cache the state we are leaving
    // we only cache non reserved system states and evaluations that would
    // put is in a different state.
    if (newActivity !== currentWorkerActivity?.name && !isCurrentlyInASystemActivity())
      this.storePendingActivityChange(currentWorkerActivity?.name || available);

    // update the activity/state only if we are not currently in that activity/state.
    if (newActivity !== currentWorkerActivity?.name) await this.setWorkerActivity(newActivity);
  };

  // evaluates which state we should be in given an availability status
  #evaluateNewState = (newAvailabilityStatus: boolean): string => {
    const { onATask, onATaskNoAcd, wrapup, wrapupNoAcd } = systemActivityNames;
    const selectedTaskStatus = getSelectedTaskStatus();
    const pendingActivity = this.getPendingActivity();

    if (selectedTaskStatus === TASK_STATUS_ACCEPTED) {
      if (newAvailabilityStatus) return onATask;
      if (!newAvailabilityStatus) return onATaskNoAcd;
    } else if (selectedTaskStatus === TASK_STATUS_WRAPPING) {
      if (newAvailabilityStatus) return wrapup;
      if (!newAvailabilityStatus) return wrapupNoAcd;
    } else {
      // fallback behavior if no task is selected but
      // tasks are in flight
      if (hasAcceptedTasks() && newAvailabilityStatus) return onATask;
      if (hasAcceptedTasks() && !newAvailabilityStatus) return onATaskNoAcd;
      if (hasWrappingTasks() && newAvailabilityStatus) return wrapup;
      if (hasWrappingTasks() && !newAvailabilityStatus) return wrapupNoAcd;
      if (pendingActivity) return pendingActivity.name;
    }

    // if none of the above iss true, no state change neccessary
    return getCurrentWorkerActivityName();
  };

  #clearPendingActivity = (): void => {
    localStorage.removeItem(this.pendingActivityChangeItemKey);
  };

  #waitForWorkerActivityChange = async (activityName: string | undefined) =>
    new Promise((resolve) => {
      if (activityName && activityName === getCurrentWorkerActivityName()) {
        resolve(null);
      } else {
        console.debug('WorkerState, waitForWorkerActivityChange, waiting for worker activity SID to be', activityName);
        // Arbitrary maxWaitTime value. Trying to balance allowing for an unexpected
        // delay updating worker activity while not holding up the calling function too long
        const maxWaitTime = 3000;
        const waitBetweenChecks = 100;
        let activityCheckCount = 0;
        const activityCheckInterval = setInterval(() => {
          if (waitBetweenChecks * activityCheckCount > maxWaitTime) {
            console.warn('Timed out waiting for worker activity SID to be', activityName);
            clearInterval(activityCheckInterval);
            resolve(null);
          } else if (activityName === getCurrentWorkerActivityName()) {
            clearInterval(activityCheckInterval);
            resolve(null);
          }
          activityCheckCount += 1;
        }, waitBetweenChecks);
      }
    });
}

const ActivityManagerSingleton = new ActivityManager();

export default ActivityManagerSingleton;
