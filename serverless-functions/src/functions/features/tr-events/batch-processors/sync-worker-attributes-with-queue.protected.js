const { processBatch, prepareBatchProcessingFunction } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);
const TaskRouter = require(Runtime.getFunctions()['common/twilio-wrappers/taskrouter'].path);
const WorkerUpdates = require(Runtime.getFunctions()['features/tr-events/common/worker-updates'].path);

const requiredParameters = [
  {
    key: 'tasks',
    purpose: 'array of remaining work item objects that contain worker SIDs to be processed',
  },
  {
    key: 'total',
    purpose: 'the total number of tasks to be processed when this was batch was started',
  },
];

snooze = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// single promise operation that takes the runtime context
// and a single work item to resolve as a completed piece of
// work.  When the work is completed it marks the work item
// as successfully completed.
updateWorkerAttributesWithQueues = (context, workItem) =>
  new Promise(async (resolve) => {
    const { sid: workerSid } = workItem;

    try {
      // worker read has a much higher limit than worker
      // update so not worrying about retries within the batch here
      const getWorkerResult = await TaskRouter.getWorker({
        context,
        workerSid,
      });

      if (getWorkerResult.success) {
        workerAttributes = getWorkerResult.worker.attributes;

        const updateWorkerResult = await WorkerUpdates.syncWorkerAttributesWithEligibleQueues(
          context,
          workerSid,
          workerAttributes,
          process.env.TWILIO_SERVICE_RETRY_LIMIT, // do not retry within the promise or it will hold up the batch
        );

        workItem.success = updateWorkerResult;
      }
      resolve(workItem);
    } catch (error) {
      console.log(`TR EVENT: Error batch processing workerSid: ${workerSid}`);
      resolve(workItem);
    }
  });

// default handler for the function
// pulls off the first TR_EVENTS_PROCESSING_BATCH_SIZE items from
// the tasks array and generates a promise array to be executed concurrently
// any successful items are then removed from the tasks array and
// passed along to the next batch processor.
exports.handler = prepareBatchProcessingFunction(
  requiredParameters,
  async (context, event, callback, response, handleError) => {
    try {
      let { tasks } = event;

      let x = 0;
      const promiseArray = [];
      const batchSize = process.env.TR_EVENTS_PROCESSING_BATCH_SIZE;
      const maxLength = tasks.length;

      while (x < batchSize && x < maxLength) {
        promiseArray.push(updateWorkerAttributesWithQueues(context, tasks[x]));
        // eslint-disable-next-line no-plusplus
        x++;
      }

      const results = await Promise.all(promiseArray);

      results.forEach((element) => {
        if (element.success) {
          tasks = tasks.filter((item) => {
            return item.sid !== element.sid;
          });
        }
      });

      await processBatch(context, event, 'features/tr-events/batch-processors/sync-worker-attributes-with-queue', {
        tasks,
        total: event.total,
        remaining: tasks.length,
      });

      return callback(null, response);
    } catch (error) {
      return handleError(error);
    }
  },
);
