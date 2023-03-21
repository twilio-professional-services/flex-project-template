import { Manager, Actions } from '@twilio/flex-ui';

import FlexHelper from './flexHelper';
import { clearPendingActivityChange } from './pendingActivity';

class WorkerActivityHelper {
  workerClient = Manager.getInstance().workerClient;

  get activity() {
    return this.workerClient?.activity;
  }

  get activityName() {
    return this.activity?.name;
  }

  get activitySid() {
    return this.activity?.sid;
  }

  waitForWorkerActivityChange = async (activitySid: string | undefined) =>
    new Promise((resolve) => {
      if (activitySid && this.activitySid === activitySid) {
        resolve(null);
      } else {
        console.debug('WorkerState, waitForWorkerActivityChange, waiting for worker activity SID to be', activitySid);
        // Arbitrary maxWaitTime value. Trying to balance allowing for an unexpected
        // delay updating worker activity while not holding up the calling function too long
        const maxWaitTime = 3000;
        const waitBetweenChecks = 100;
        let activityCheckCount = 0;
        const activityCheckInterval = setInterval(() => {
          if (waitBetweenChecks * activityCheckCount > maxWaitTime) {
            console.warn('Timed out waiting for worker activity SID to be', activitySid);
            clearInterval(activityCheckInterval);
            resolve(null);
          } else if (this.activitySid === activitySid) {
            clearInterval(activityCheckInterval);
            resolve(null);
          }
          activityCheckCount += 1;
        }, waitBetweenChecks);
      }
    });

  canChangeWorkerActivity = (targetActivitySid: any) => {
    let canChange = true;

    // TaskRouter will not allow a worker to change from an available activity
    // to any other activity if the worker has a pending reservation without
    //  rejecting that reservation, which isn't what we want to do in this use case
    if (FlexHelper.isAnAvailableActivityBySid(targetActivitySid) && FlexHelper.hasPendingTask) {
      canChange = false;
    }

    return canChange;
  };

  setWorkerActivity = (newActivitySid?: any, clearPendingActivity?: any) => {
    try {
      const targetActivity = FlexHelper.getActivityBySid(newActivitySid);
      console.log('FlexState', FlexHelper);
      console.log('targetActivity', targetActivity);
      console.log('newActivitySid', newActivitySid);
      if (!this.canChangeWorkerActivity(newActivitySid)) {
        console.debug(
          'setWorkerActivity: Not permitted to change worker activity at this time. Target activity:',
          targetActivity?.name,
        );
        return;
      }
      if (this.activitySid === newActivitySid) {
        console.debug(`setWorkerActivity: Worker already in activity "${targetActivity?.name}". No change needed.`);
      } else {
        console.log('setWorkerActivity: ', targetActivity?.name);
        Actions.invokeAction('SetActivity', {
          activitySid: newActivitySid,
          isInvokedByPlugin: true,
        });
      }
      if (clearPendingActivity) {
        clearPendingActivityChange();
      }
    } catch (error) {
      console.error('setWorkerActivity: Error setting worker activity SID', error);
    }
  };
}

const WorkerActivityHelperSingleton = new WorkerActivityHelper();
export default WorkerActivityHelperSingleton;
