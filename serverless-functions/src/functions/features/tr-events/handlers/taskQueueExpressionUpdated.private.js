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

    // set up object to be processed in batch.
    toBeProcessed = {
      tasks: workers,
      total: workers.length,
      remaining: workers.length,
    };

    await processBatch(
      context,
      event,
      'features/tr-events/batch-processors/sync-worker-attributes-with-queue',
      toBeProcessed,
    );
  } catch (error) {
    console.log(`TR EVENT: Error in workerCreated.syncAttributesWithEligibleQueues: ${error}`);
  }
};
