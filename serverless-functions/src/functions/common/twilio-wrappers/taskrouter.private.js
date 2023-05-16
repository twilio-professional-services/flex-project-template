const { merge, isString, isObject, isNumber, isBoolean, omitBy, isNil } = require('lodash');
const axios = require('axios');

const retryHandler = require(Runtime.getFunctions()['common/helpers/retry-handler'].path).retryHandler;

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {string} parameters.taskSid the task to update
 * @param {string} parameters.attributesUpdate a JSON object to merge with the task
 * @returns {object} an object containing the task if successful
 * @description this operation safely updates the task attributes with the object
 * given by performing a deep merge with the existing task attributes and ensuring
 * its updating the version it started with using the ETag header
 * more explained here https://www.twilio.com/docs/taskrouter/api/task#task-version
 */
exports.updateTaskAttributes = async function updateTaskAttributes(parameters) {
  const { taskSid, attributesUpdate } = parameters;

  if (!isString(taskSid))
    throw new Error('Invalid parameters object passed. Parameters must contain the taskSid string');
  if (!isString(attributesUpdate))
    throw new Error('Invalid parameters object passed. Parameters must contain attributesUpdate JSON string');

  try {
    const taskContextURL = `https://taskrouter.twilio.com/v1/Workspaces/${process.env.TWILIO_FLEX_WORKSPACE_SID}/Tasks/${taskSid}`;
    const config = {
      auth: {
        username: process.env.ACCOUNT_SID,
        password: process.env.AUTH_TOKEN,
      },
    };

    // we need to fetch the task using a rest API because
    // we need to examine the headers to get the ETag
    const getResponse = await axios.get(taskContextURL, config);
    let task = getResponse.data;
    task.attributes = JSON.parse(getResponse.data.attributes);
    task.revision = JSON.parse(getResponse.headers.etag);

    // merge the objects
    const updatedTaskAttributes = omitBy(merge({}, task.attributes, JSON.parse(attributesUpdate)), isNil);

    // if-match the revision number to ensure
    // no update collisions
    config.headers = {
      'If-Match': task.revision,
      'content-type': 'application/x-www-form-urlencoded',
    };

    data = new URLSearchParams({
      Attributes: JSON.stringify(updatedTaskAttributes),
    });

    task = (await axios.post(taskContextURL, data, config)).data;

    return {
      success: true,
      status: 200,
      task: {
        ...task,
        attributes: JSON.parse(task.attributes),
      },
    };
  } catch (error) {
    return retryHandler(error, parameters, exports.updateTaskAttributes);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.taskSid the task to update
 * @param {string} parameters.reason a JSON object to merge with the task
 * @returns {object} an object containing the task if successful
 * @description this operation safely completes the task with the given reason
 */
exports.completeTask = async function completeTask(parameters) {
  const { taskSid, reason, context } = parameters;

  if (!isString(taskSid))
    throw new Error('Invalid parameters object passed. Parameters must contain the taskSid string');
  if (!isString(reason)) throw new Error('Invalid parameters object passed. Parameters must contain reason string');
  if (!isObject(context)) throw new Error('Invalid parameters object passed. Parameters must contain context object');

  try {
    const client = context.getTwilioClient();

    const task = await client.taskrouter.v1
      .workspaces(process.env.TWILIO_FLEX_WORKSPACE_SID)
      .tasks(taskSid)
      .update({ assignmentStatus: 'completed', reason });

    return {
      success: true,
      status: 200,
      task,
    };
  } catch (error) {
    // 20001 error code is returned when the task is not in an assigned state
    // this can happen if its not been assigned at all or its been already closed
    // through another process; as a result assuming the latter and
    // treating as a success
    // https://www.twilio.com/docs/api/errors/20001
    // 20404 error code is returned when the task no longer exists
    // in which case it is also assumed to be completed
    // https://www.twilio.com/docs/api/errors/20404
    if (error.code === 20001 || error.code === 20404) {
      console.warn(`${context.PATH}.completeTask(): ${error.message}`);
      return {
        success: true,
        status: 200,
        message: error.message,
      };
    }
    return retryHandler(error, parameters, exports.completeTask);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.taskSid the task to update
 * @param {string} parameters.reservationSid the reservation to update
 * @param {string} parameters.status the status, can be "wrapping" or "completed"
 * @returns {object} an object containing the task if successful
 * @description this operation safely moves the reservation to wrapup
 */
exports.updateReservation = async function updateReservation(parameters) {
  const { context, taskSid, reservationSid, status } = parameters;

  if (!isString(taskSid))
    throw new Error('Invalid parameters object passed. Parameters must contain the taskSid string');
  if (!isString(reservationSid))
    throw new Error('Invalid parameters object passed. Parameters must contain reservationSid string');
  if (!isObject(context))
    throw new Error('Invalid parameters object passed. Parameters must contain reason context object');
  if (!isString(status) || (status !== 'completed' && status !== 'wrapping'))
    throw new Error(
      'Invalid parameters object passed. Parameters must contain status to update the reservation to and it must be one of "completed" or "wrapping"',
    );

  try {
    const client = context.getTwilioClient();

    const reservation = await client.taskrouter.v1
      .workspaces(process.env.TWILIO_FLEX_WORKSPACE_SID)
      .tasks(taskSid)
      .reservations(reservationSid)
      .update({ reservationStatus: status });

    return {
      success: true,
      status: 200,
      reservation,
    };
  } catch (error) {
    // 20001 error code is returned when the reservation is not in an assigned
    // state this can happen if its not been assigned at all or its been already
    // closed through another process; as a result assuming the latter and
    // treating as a success
    // https://www.twilio.com/docs/api/errors/20001
    // 20404 error code is returned when the reservation no longer exists
    // in which case it is also assumed to be completed
    // https://www.twilio.com/docs/api/errors/20404
    if (error.code === 20001 || error.code === 20404) {
      console.warn(`${context.PATH}.updateReservation(): ${error.message}`);
      return {
        success: true,
        status: 200,
        message: error.message,
      };
    }
    return retryHandler(error, parameters, exports.updateReservation);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.workflowSid the workflow to submit the task
 * @param {string} parameters.taskChannel the task channel to submit the task on
 * @param {object} parameters.attributes the attributes applied to the task
 * @param {number} parameters.priority the priority
 * @param {number} parameters.timeout timeout
 * @returns {object} an object containing the task if successful
 * @description creates a task
 */
exports.createTask = async function createTask(parameters) {
  const {
    context,
    workflowSid,
    taskChannel,
    attributes,
    priority: overriddenPriority,
    timeout: overriddenTimeout,
  } = parameters;

  if (!isObject(context)) throw new Error('Invalid parameters object passed. Parameters must contain context object');
  if (!isString(workflowSid) || workflowSid.length === 0)
    throw new Error('Invalid parameters object passed. Parameters must contain workflowSid string');
  if (!isString(taskChannel) || taskChannel.length === 0)
    throw new Error('Invalid parameters object passed. Parameters must contain taskChannel string');
  if (!isObject(attributes))
    throw new Error('Invalid parameters object passed. Parameters must contain attributes object');

  const timeout = overriddenTimeout || 86400;
  const priority = overriddenPriority || 0;

  try {
    const client = context.getTwilioClient();
    const task = await client.taskrouter.v1.workspaces(process.env.TWILIO_FLEX_WORKSPACE_SID).tasks.create({
      attributes: JSON.stringify(attributes),
      workflowSid,
      taskChannel,
      priority,
      timeout,
    });

    return {
      success: true,
      taskSid: task.sid,
      task: {
        ...task,
        attributes: JSON.parse(task.attributes),
      },
      status: 200,
    };
  } catch (error) {
    return retryHandler(error, parameters, exports.createTask);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @returns {object} An object containing an array of queues for the account
 * @description the following method is used to robustly retrieve
 *   the queues for the account
 */
exports.getQueues = async function getQueues(parameters) {
  const { context } = parameters;

  if (!isObject(context)) throw new Error('Invalid parameters object passed. Parameters must contain context object');

  try {
    const client = context.getTwilioClient();
    const queues = await client.taskrouter.v1
      .workspaces(process.env.TWILIO_FLEX_WORKSPACE_SID)
      .taskQueues.list({ limit: 1000 });

    return {
      success: true,
      status: 200,
      queues,
    };
  } catch (error) {
    return retryHandler(error, parameters, exports.getQueues);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.workerSid the worker sid to fetch channels for
 * @returns {object} worker channel object
 * @description the following method is used to fetch the configured
 *   worker channel
 */
exports.getWorkerChannels = async function updateWorkerChannel(parameters) {
  const { context, workerSid } = parameters;

  if (!isObject(context)) throw new Error('Invalid parameters object passed. Parameters must contain context object');
  if (!isString(workerSid))
    throw new Error('Invalid parameters object passed. Parameters must contain workerSid string');

  try {
    const client = context.getTwilioClient();
    const workerChannels = await client.taskrouter.v1
      .workspaces(process.env.TWILIO_FLEX_WORKSPACE_SID)
      .workers(workerSid)
      .workerChannels.list();

    return {
      success: true,
      status: 200,
      workerChannels,
    };
  } catch (error) {
    return retryHandler(error, parameters, exports.getWorkerChannels);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @returns {object} worker channel capacity object
 * @description the following method is used to robustly update
 *   worker channel capacity
 */
exports.updateWorkerChannel = async function updateWorkerChannel(parameters) {
  const { context, workerSid, workerChannelSid, capacity, available } = parameters;

  if (!isObject(context)) throw new Error('Invalid parameters object passed. Parameters must contain context object');
  if (!isString(workerSid))
    throw new Error('Invalid parameters object passed. Parameters must contain workerSid string');
  if (!isString(workerChannelSid))
    throw new Error('Invalid parameters object passed. Parameters must contain workerChannelSid string');
  if (!isNumber(capacity)) throw new Error('Invalid parameters object passed. Parameters must contain capacity number');
  if (!isBoolean(available))
    throw new Error('Invalid parameters object passed. Parameters must contain available boolean');

  try {
    const client = context.getTwilioClient();
    const workerChannelCapacity = await client.taskrouter.v1
      .workspaces(process.env.TWILIO_FLEX_WORKSPACE_SID)
      .workers(workerSid)
      .workerChannels(workerChannelSid)
      .update({ capacity, available });

    return {
      success: true,
      status: 200,
      workerChannelCapacity,
    };
  } catch (error) {
    return retryHandler(error, parameters, exports.updateWorkerChannel);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.taskSid the task to update
 * @param {object} parameters.updateParams parameters to update on the task
 * @returns {object} an object containing the task if successful
 * @description updates the given task with the given params
 */
exports.updateTask = async function updateTask(parameters) {
  const { taskSid, updateParams, context } = parameters;

  if (!isString(taskSid))
    throw new Error('Invalid parameters object passed. Parameters must contain the taskSid string');
  if (!isObject(updateParams))
    throw new Error('Invalid parameters object passed. Parameters must contain updateParams object');
  if (!isObject(context))
    throw new Error('Invalid parameters object passed. Parameters must contain reason context object');

  try {
    const client = context.getTwilioClient();

    const task = await client.taskrouter.v1
      .workspaces(process.env.TWILIO_FLEX_WORKSPACE_SID)
      .tasks(taskSid)
      .update(updateParams);

    return {
      success: true,
      status: 200,
      task: {
        ...task,
        attributes: JSON.parse(task.attributes),
      },
    };
  } catch (error) {
    // 20001 error code is returned when the task is not in an assigned state
    // this can happen if its not been assigned at all or its been already closed
    // through another process; as a result assuming the latter and
    // treating as a success
    // https://www.twilio.com/docs/api/errors/20001
    // 20404 error code is returned when the task no longer exists
    // in which case it is also assumed to be completed
    // https://www.twilio.com/docs/api/errors/20404
    if (error.code === 20001 || error.code === 20404) {
      console.warn(`${context.PATH}.updateTask(): ${error.message}`);
      return {
        success: true,
        status: 200,
        message: error.message,
      };
    }
    return retryHandler(error, parameters, exports.updateTask);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.taskSid the task to fetch
 * @returns {object} an object containing the task if successful
 * @description fetches the given task
 */
exports.fetchTask = async function fetchTask(parameters) {
  const { taskSid, context } = parameters;

  if (!isString(taskSid))
    throw new Error('Invalid parameters object passed. Parameters must contain the taskSid string');
  if (!isObject(context))
    throw new Error('Invalid parameters object passed. Parameters must contain reason context object');

  try {
    const client = context.getTwilioClient();

    const task = await client.taskrouter.v1.workspaces(process.env.TWILIO_FLEX_WORKSPACE_SID).tasks(taskSid).fetch();

    return {
      success: true,
      status: 200,
      task: {
        ...task,
        attributes: JSON.parse(task.attributes),
      },
    };
  } catch (error) {
    // 20001 error code is returned when the task is not in an assigned state
    // this can happen if its not been assigned at all or its been already closed
    // through another process; as a result assuming the latter and
    // treating as a success
    // https://www.twilio.com/docs/api/errors/20001
    // 20404 error code is returned when the task no longer exists
    // in which case it is also assumed to be completed
    // https://www.twilio.com/docs/api/errors/20404
    if (error.code === 20001 || error.code === 20404) {
      console.warn(`${context.PATH}.fetchTask(): ${error.message}`);
      return {
        success: true,
        status: 200,
        message: error.message,
      };
    }
    return retryHandler(error, parameters, exports.fetchTask);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.workflowSid (optional) the workflow SID to filter by
 * @param {string} parameters.assignmentStatus (optional) the assignment status to filter by
 * @param {string} parameters.ordering (optional) the desired ordering (e.g. DateCreated:desc)
 * @param {number} parameters.limit (optional) the maximum number of tasks to return (default 1000)
 * @returns {object} An object containing an array of tasks for the account
 * @description the following method is used to robustly retrieve
 *  tasks for the account
 */
exports.getTasks = async function getTasks(parameters) {
  const { context, workflowSid, assignmentStatus, ordering, limit } = parameters;

  if (!isObject(context)) throw new Error('Invalid parameters object passed. Parameters must contain context object');

  try {
    const client = context.getTwilioClient();
    const tasks = await client.taskrouter.v1
      .workspaces(process.env.TWILIO_FLEX_WORKSPACE_SID)
      .tasks.list({ limit, workflowSid, assignmentStatus, ordering });

    return {
      success: true,
      status: 200,
      tasks: tasks.map((task) => {
        return {
          ...task,
          attributes: JSON.parse(task.attributes),
        };
      }),
    };
  } catch (error) {
    return retryHandler(error, parameters, exports.getTasks);
  }
};
