const { processBatch } = require(Runtime.getFunctions()['common/helpers/function-helper'].path);
const TaskRouter = require(Runtime.getFunctions()['common/twilio-wrappers/taskrouter'].path);

/* Example Event
  EventType: 'task-queue.expression.updated',
  ResourceType: 'taskqueue',
  TaskQueueName: 'MyQueueName',
  Timestamp: '1692816604',
  AccountSid: 'AC...',
  Sid: 'EV...',
  TimestampMs: '1692816604478',
  TaskQueueTargetExpression: "routing.skills HAS 'billing'",
  WorkspaceSid: 'WS...',
  WorkspaceName: 'Flex Task Assignment',
  TaskQueueSid: 'WQ...',
  OperatingUnitSid: 'OU47c2620d241d3ca53a1a31cee92287c6',
  EventDescription: "TaskQueue WQ... expression updated to 'routing.skills HAS 'billing''",
  ResourceSid: 'WQ..'
*/

// when a task queue expression is updated
// this function will trigger all workers to be re-evaluated for their
// eligible queues.  This is necessary as we potentially need to remove the queue
// from some workers and add the queue to others.  Ideally we would keep a cache
// of the eligible worker sids for a queue so we could compare with the new list
// and update only thee deltas (ones removed and ones added to the list) however
// a robust caching mechanism with the tools available is quite hard to accomplish
// for an unbound object size.  Given how robust and quick the updates are, solution
// opted for is to just re-evaluate all the workers.

exports.syncWorkerAttributesWithEligibleQueues = async function syncWorkerAttributesWithEligibleQueues(context, event) {
  try {
    // when we update a queue we may need to remove the queue from
    // some workers that were previously eligible so until we can
    // introduce a caching mechanism we can just re-evaluate all workers
    const eligibleWorkersList = await TaskRouter.getEligibleWorkers({
      context,
      targetWorkersExpression: '1==1',
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
