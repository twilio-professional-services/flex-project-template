const { prepareStudioFunction, extractStandardResponse } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);

const WorkerAttributesUpdated = require(Runtime.getFunctions()['features/tr-events/handlers/workerAttributesUpdated']
  .path);
const WorkerCreated = require(Runtime.getFunctions()['features/tr-events/handlers/workerCreated'].path);
const TaskQueueCreated = require(Runtime.getFunctions()['features/tr-events/handlers/taskQueueCreated'].path);

const requiredParameters = [];

exports.handler = prepareStudioFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const { EventType } = event;
    // console.log(event);

    // WARNING: TASK EVENTS SHOULD NOT BE HANDLED IN HERE DUE TO VOLUME
    // WARNING: BE VERY CAREFUL WITH EVENT ACTIONS TRIGGERING THE SAME EVENT
    // AND CREATING A LOOP
    // INFO: IF YOU HAVE ACCIDENTALLY TRIGGERED A LOOP, RESET THE CALLBACK URL
    // FOR YOUR WORKSPACE TO BREAK IT

    switch (EventType) {
      case 'worker.created':
        if (process.env.LOG_EVENTS === 'true')
          console.log(`Event Received: Worker ${event.WorkerName}:${event.WorkerSid} created`);
        await WorkerCreated.syncWorkerAttributesWithEligibleQueues(context, event);
        break;
      case 'worker.attributes.update':
        if (process.env.LOG_EVENTS === 'true')
          console.log(`Event Received: Worker ${event.WorkerName}:${event.WorkerSid} attributes updated`);
        await WorkerAttributesUpdated.syncWorkerAttributesWithEligibleQueues(context, event);
        break;
      case 'task-queue.created':
        if (process.env.LOG_EVENTS === 'true') console.log(`Event Received: Task Queue ${event.TaskQueueName} created`);
        await TaskQueueCreated.syncWorkerAttributesWithEligibleQueues(context, event);
        break;
      case 'task-queue.expression.updated':
        if (process.env.LOG_EVENTS === 'true')
          console.log('task queue... load using target expression, compare to existing process delta');
        break;
      default:
        console.error(`Unrecognized event type: ${EventType}`);
    }

    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
