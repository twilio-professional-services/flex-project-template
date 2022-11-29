import { ITask, Manager, TaskHelper, WorkerAttributes } from '@twilio/flex-ui';
import { Worker as InstantQueryWorker } from 'types/sync/InstantQuery';
import { UIAttributes } from "types/manager/ServiceConfiguration";

const { custom_data } = Manager.getInstance().configuration as UIAttributes;
const { call_target } = custom_data?.features?.internal_call || {};

export const isInternalCall = (task: ITask) => task.attributes.client_call === true

export const makeInternalCall = (manager: Manager, selectedWorker: InstantQueryWorker) => {
  const { workflow_sid, queue_sid, caller_id } =
    manager.serviceConfiguration.outbound_call_flows.default;
  
  if (!manager.workerClient) {
    return;
  }

  const {
    name: fromName
  } = manager.workerClient;
  
  const {
    contact_uri: from_uri,
    full_name: fromFullName
  } = manager.workerClient.attributes as WorkerAttributes;

  const {
    attributes: { full_name },
    friendly_name,
    worker_sid
  } = selectedWorker;

  manager.workerClient.createTask(
    call_target,
    caller_id,
    workflow_sid,
    queue_sid,
    {
      attributes: {
        to: full_name || friendly_name,
        name: "Internal Call",
        fromName: fromFullName || fromName,
        targetWorker: from_uri,
        targetWorkerSid: worker_sid,
        autoAnswer: "true",
        client_call: true,
      },
      taskChannelUniqueName: "voice",
    }
  );
};

export const waitForTransfer = (task: ITask): Promise<boolean> =>
new Promise((resolve) => {
  const waitTimeMs = 100;
  // Wait until the task is in a transferrable state.
  const maxWaitTimeMs = 60000;
  let waitForTransferInterval: null | NodeJS.Timeout = setInterval(async () => {
    
    if (!TaskHelper.canTransfer(task)) {
      return;
    }

    if (waitForTransferInterval) {
      clearInterval(waitForTransferInterval);
      waitForTransferInterval = null;
    }

    resolve(true);
  }, waitTimeMs);

  setTimeout(() => {
    if (waitForTransferInterval) {
      console.debug(
        `Task didn't become transferrable within ${
          maxWaitTimeMs / 1000
        } seconds`
      );
      
      if (waitForTransferInterval) {
        clearInterval(waitForTransferInterval);
        waitForTransferInterval = null;
      }

      resolve(false);
    }
  }, maxWaitTimeMs);
});