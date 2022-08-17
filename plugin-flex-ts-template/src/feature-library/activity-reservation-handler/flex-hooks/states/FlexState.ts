import { Manager, TaskHelper } from "@twilio/flex-ui";

class FlexState {
  //#region Static Properties
  _manager = Manager.getInstance();

  accountSid: any;
  //#endregion Static Properties

  //#region Dynamic Properties
  get flexState() {
    return this._manager.store.getState().flex;
  }

  get otherSessionDetected() {
    return this.flexState?.session?.singleSessionGuard?.otherSessionDetected;
  }

  get offlineActivitySid() {
    return this._manager.serviceConfiguration.taskrouter_offline_activity_sid;
  }

  get pendingActivityChangeItemKey() {
    return `pendingActivityChange_${this.accountSid}`;
  }

  get pendingActivity() {
    const item = localStorage.getItem(this.pendingActivityChangeItemKey);

    return item && JSON.parse(item);
  }

  get workerActivities() {
    return this.flexState?.worker?.activities || new Map();
  }

  get workerTasks() {
    return this.flexState.worker.tasks;
  }

  get hasLiveCallTask() {
    if (!this.workerTasks) return false;

    return [...this.workerTasks.values()].some((task) =>
      TaskHelper.isLiveCall(task)
    );
  }

  /**
   * Returns true if there is a pending or live call task
   */
  get hasActiveCallTask() {
    if (!this.workerTasks) return false;

    return [...this.workerTasks.values()].some((task) => {
      return (
        TaskHelper.isCallTask(task) &&
        (TaskHelper.isPending(task) || TaskHelper.isLiveCall(task))
      );
    });
  }

  get hasActiveTask() {
    if (!this.workerTasks) return false;

    return [...this.workerTasks.values()].some(
      (task) =>
        TaskHelper.isTaskAccepted(task) && !TaskHelper.isInWrapupMode(task)
    );
  }

  get hasWrappingTask() {
    if (!this.workerTasks) return false;

    return [...this.workerTasks.values()].some((task) =>
      TaskHelper.isInWrapupMode(task)
    );
  }

  get hasPendingTask() {
    if (!this.workerTasks) return false;

    return [...this.workerTasks.values()].some((task) =>
      TaskHelper.isPending(task)
    );
  }
  //#endregion Dynamic Properties

  //#region Class Methods
  initialize = () => {
    // Setting accountSid as a static property so it survives after
    // logout when several flexState objects are cleared
    this.accountSid = this.flexState.worker.source.accountSid;
  };

  getActivityBySid = (activitySid: string) => {
    return this.workerActivities.get(activitySid);
  };

  getActivityByName = (activityName: string) => {
    const activities = [...this.workerActivities.values()];
    return activities.find(
      (a) => a?.name?.toLowerCase() === activityName.toLowerCase()
    );
  };

  isAnAvailableActivityBySid = (activitySid: string) => {
    return this.getActivityBySid(activitySid)?.available;
  };

  storePendingActivityChange = (activity: any, isUserSelected?: boolean) => {
    // Pulling out only the relevant activity properties to avoid
    // a circular structure error in JSON.stringify()
    const pendingActivityChange = {
      available: activity.available,
      isUserSelected,
      name: activity.name,
      sid: activity.sid,
    };

    localStorage.setItem(
      this.pendingActivityChangeItemKey,
      JSON.stringify(pendingActivityChange)
    );
  };

  clearPendingActivityChange = () => {
    localStorage.removeItem(this.pendingActivityChangeItemKey);
  };
  //#endregion Class Methods
}

const FlexStateSingleton = new FlexState();

export default FlexStateSingleton;
