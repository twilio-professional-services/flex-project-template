const { isEqual } = require('lodash');

const TaskRouter = require(Runtime.getFunctions()['common/twilio-wrappers/taskrouter'].path);
const WorkerUpdates = require(Runtime.getFunctions()['features/tr-events/common/worker-updates'].path);

/* Example Event

  WorkerActivityName: 'Offline',
  EventType: 'worker.created',
  ResourceType: 'worker',
  Timestamp: '1692642403',
  WorkerActivitySid: 'WA...',
  AccountSid: 'AC...',
  WorkerName: 'test',
  Sid: 'EV...',
  TimestampMs: '1692642403000',
  WorkerVersion: '0',
  WorkerSid: 'WK...',
  WorkspaceSid: 'WSdb437c2540b6c5e1cc647f17bfb56178',
  WorkspaceName: 'Flex Task Assignment',
  OperatingUnitSid: 'OU...',
  EventDescription: 'Worker test created',
  ResourceSid: 'WK...',
  WorkerAttributes: '{}'

*/

exports.syncWorkerAttributesWithEligibleQueues = async function syncWorkerAttributesWithEligibleQueues(context, event) {
  try {
    const { WorkerSid: workerSid } = event;

    const getWorkerResult = await TaskRouter.getWorker({
      context,
      workerSid,
    });

    if (!getWorkerResult.success)
      throw new Error('workerCreated.syncWorkerAttributesWithEligibleQueues: Unable to get worker');

    // grab the worker attributes from the event
    // showing the new updated attributes
    workerAttributes = getWorkerResult.worker.attributes;

    return await WorkerUpdates.syncWorkerAttributesWithEligibleQueues(context, workerSid, workerAttributes);
  } catch (error) {
    console.log(`Error in workerCreated.syncWorkerAttributesWithEligibleQueues: ${error}`);
    return false;
  }
};
