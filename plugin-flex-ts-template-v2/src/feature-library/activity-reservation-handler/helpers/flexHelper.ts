import { Manager, TaskHelper, ITask } from "@twilio/flex-ui";
import Activity from "../../../types/task-router/Activity";

class FlexHelper {
  //#region Static Properties
  _manager = Manager.getInstance();

  accountSid: any;
  //#endregion Static Properties

  //#region Dynamic Properties
  get flexState() {
    return this._manager.store.getState().flex;
  }

  get otherSessionDetected(): string | undefined {
    return this.flexState?.session?.singleSessionGuard?.otherSessionDetected;
  }

  get offlineActivitySid(): string | undefined {
    return this._manager.serviceConfiguration.taskrouter_offline_activity_sid;
  }

  get workerActivities(): Map<string, Activity> {
    return this.flexState?.worker?.activities || new Map();
  }

  get workerTasks(): Map<string, ITask> {
    return this.flexState.worker.tasks;
  }

  get hasLiveCallTask(): boolean {
    if (!this.workerTasks) return false;

    return [...this.workerTasks.values()].some((task) =>
      TaskHelper.isLiveCall(task)
    );
  }

  /**
   * Returns true if there is a pending or live call task
   */
  get hasActiveCallTask(): boolean {
    if (!this.workerTasks) return false;

    return [...this.workerTasks.values()].some((task) => {
      return (
        TaskHelper.isCallTask(task) &&
        (TaskHelper.isPending(task) || TaskHelper.isLiveCall(task))
      );
    });
  }

  get hasActiveTask(): boolean {
    if (!this.workerTasks) return false;

    return [...this.workerTasks.values()].some(
      (task) =>
        TaskHelper.isTaskAccepted(task) && !TaskHelper.isInWrapupMode(task)
    );
  }

  get hasWrappingTask(): boolean {
    if (!this.workerTasks) return false;

    return [...this.workerTasks.values()].some((task) =>
      TaskHelper.isInWrapupMode(task)
    );
  }

  get hasPendingTask(): boolean {
    if (!this.workerTasks) return false;

    return [...this.workerTasks.values()].some((task) =>
      TaskHelper.isPending(task)
    );
  }
  //#endregion Dynamic Properties

  //#region Class Methods
  initialize = (): void => {
    // Setting accountSid as a static property so it survives after
    // logout when several flexState objects are cleared
    this.accountSid = this.flexState.worker.source?.accountSid;
  };

  getActivityBySid = (activitySid: string): Activity | undefined => {
    return this.workerActivities.get(activitySid);
  };

  getActivityByName = (activityName: string): Activity | undefined => {
    const activities = [...this.workerActivities.values()];
    return activities.find(
      (a) => a?.name?.toLowerCase() === activityName.toLowerCase()
    );
  };

  isAnAvailableActivityBySid = (activitySid: string): boolean => {
    return !!this.getActivityBySid(activitySid)?.available;
  };
  //#endregion Class Methods
}

const FlexHelperSingleton = new FlexHelper();

export default FlexHelperSingleton;
