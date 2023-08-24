const { processBatch } = require(Runtime.getFunctions()['common/helpers/function-helper'].path);
const TaskRouter = require(Runtime.getFunctions()['common/twilio-wrappers/taskrouter'].path);

/* Example Event
  EventType: 'task-queue.created',
  ResourceType: 'taskqueue',
  TaskQueueName: 'MyTestQueue',
  Timestamp: '1692644679',
  AccountSid: 'AC...',
  Sid: 'EV...',
  TimestampMs: '1692644679861',
  TaskQueueTargetExpression: '1==1',
  WorkspaceSid: 'WS...',
  WorkspaceName: 'Flex Task Assignment',
  TaskQueueSid: 'WQ...',
  OperatingUnitSid: 'OU...',
  EventDescription: 'TaskQueue WQ... created',
  ResourceSid: 'WQ...'
*/

// when a task queue is created this function will
// identify all the eligible workers for that queue
// and ensure their queues list includes the new queue
// by passing the identified list of eligible workers
// to a batch processor.
exports.syncWorkerAttributesWithEligibleQueues = async function syncWorkerAttributesWithEligibleQueues(context, event) {
  try {
    // get the eligible queues for that worker
    const eligibleWorkersList = await TaskRouter.getEligibleWorkers({
      context,
      targetWorkersExpression: event.TaskQueueTargetExpression,
      workerSidOnly: true,
    });

    const { workers } = eligibleWorkersList;

    await processBatch(context, event, 'features/tr-events/batch-processors/sync-worker-attributes-with-queue', {
      tasks: workers,
      total: workers.length,
      remaining: workers.length,
    });
  } catch (error) {
    console.log(`TR EVENT: Error in workerCreated.syncAttributesWithEligibleQueues: ${error}`);
  }
};
