const { handOffProcessing, prepareHandoffFunction } = require(Runtime.getFunctions()['common/helpers/function-helper']
  .path);

const TaskRouter = require(Runtime.getFunctions()['common/twilio-wrappers/taskrouter'].path);
const WorkerUpdates = require(Runtime.getFunctions()['features/tr-events/common/worker-updates'].path);

const requiredParameters = [];

snooze = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

updateWorkerAttributesWithQueues = (context, workItem) =>
  new Promise(async (resolve) => {
    const { sid: workerSid } = workItem;

    try {
      // worker read has a much higher limit than worker
      // update so not worry about retries within the batch here
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
      console.log(`Error batch processing workerSid: ${workerSid}`);
      resolve(workItem);
    }
  });

exports.handler = prepareHandoffFunction(
  requiredParameters,
  async (context, event, callback, response, handleError) => {
    try {
      console.log('BATCH PROCESSOR TASK COUNT:', event.tasks.length);

      let { tasks } = event;

      let x = 0;
      const promiseArray = [];
      const batchSize = process.env.PROCESSING_BATCH_SIZE;
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

      if (tasks.length > 0) {
        // set up object to be processed in batch.
        toBeProcessed = {
          tasks,
          total: event.total,
          remaining: tasks.length,
        };

        await handOffProcessing(
          context,
          event,
          'features/tr-events/batch-processors/sync-worker-attributes-with-queue',
          toBeProcessed,
        );
      }

      return callback(null, response);
    } catch (error) {
      return handleError(error);
    }
  },
);
