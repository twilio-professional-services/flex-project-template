import { Manager } from '@twilio/flex-ui';

class WorkerState {
  _manager = Manager.getInstance();

  get workerClient() { return this._manager.workerClient; }

  get workerActivity() { return this.workerClient.activity; }

  get workerActivityName() { return this.workerActivity?.name; }

  get workerActivitySid() { return this.workerActivity?.sid; }

  waitForWorkerActivityChange = (activitySid: string) => new Promise(resolve => {
    if (this.workerActivitySid === activitySid) {
      return;
    }

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
        //resolve();
      } else if (this.workerActivitySid === activitySid) {
        clearInterval(activityCheckInterval);
        //resolve();
      }
      activityCheckCount += 1;
    }, waitBetweenChecks)
  })
}

const WorkerStateSingleton = new WorkerState();

export default WorkerStateSingleton;
