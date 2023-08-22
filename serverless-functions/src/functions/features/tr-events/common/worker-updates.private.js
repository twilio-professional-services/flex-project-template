const { isEqual } = require('lodash');

const TaskRouter = require(Runtime.getFunctions()['common/twilio-wrappers/taskrouter'].path);

exports.syncWorkerAttributesWithEligibleQueues = async function syncWorkerAttributesWithEligibleQueues(
  context,
  workerSid,
  workerAttributes,
  attempts = 0,
) {
  try {
    existingQueues = workerAttributes.queues;

    // get the eligible queues for that worker
    const workerQueuesResult = await TaskRouter.getQueues({
      context,
      filters: {
        workerSid,
      },
    });

    // generate a queue array for that queue list
    const { queues: fullQueueData } = workerQueuesResult;
    const queues = fullQueueData
      ? fullQueueData.map((queue) => {
          const { sid } = queue;
          return sid;
        })
      : [];

    let success = true;
    // compare the existing queue array
    // to the old one to see if it needs updated
    if (!isEqual(existingQueues, queues)) {
      const updateWorkerResult = await TaskRouter.updateWorkerAttributes({
        context,
        workerSid,
        workerAttributes: {
          ...workerAttributes,
          queues,
        },
        attempts, // for batch processing don't retry
      });

      success = updateWorkerResult.success;
    }

    return success;
  } catch (error) {
    console.error(`Error in worker-updates.syncWorkerAttributesWithEligibleQueues: ${error}`);
    return false;
  }
};
