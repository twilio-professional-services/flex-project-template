const { merge, isString, isObject, omitBy, isNil } = require('lodash');
const axios = require('axios');

const { executeWithRetry, twilioExecute } = require(Runtime.getFunctions()['common/helpers/function-helper'].path);

/**
 * @param {object} parameters the parameters for the function
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.taskSid the task to update
 * @param {string} parameters.attributesUpdate a JSON object to merge with the task
 * @returns {object} an object containing the task if successful
 * @description this operation safely updates the task attributes with the attributesUpdate
 * object given by performing a deep merge with the existing task attributes and ensuring
 * its updating the version it started with using the ETag header
 * more explained here https://www.twilio.com/docs/taskrouter/api/task#task-version
 */
exports.updateTaskAttributes = async function updateTaskAttributes(parameters) {
  const { context, taskSid, attributesUpdate } = parameters;

  if (!isString(taskSid))
    throw new Error('Invalid parameters object passed. Parameters must contain the taskSid string');
  if (!isString(attributesUpdate))
    throw new Error('Invalid parameters object passed. Parameters must contain attributesUpdate JSON string');
  if (!isObject(context)) throw new Error('Invalid parameters object passed. Parameters must contain context object');

  const taskContextURL = `https://taskrouter.twilio.com/v1/Workspaces/${process.env.TWILIO_FLEX_WORKSPACE_SID}/Tasks/${taskSid}`;
  const config = {
    auth: {
      username: process.env.ACCOUNT_SID,
      password: process.env.AUTH_TOKEN,
    },
  };

  return executeWithRetry(context, async () => {
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

    const postData = new URLSearchParams({
      Attributes: JSON.stringify(updatedTaskAttributes),
    });

    task = (await axios.post(taskContextURL, postData, config)).data;

    return {
      ...task,
      attributes: JSON.parse(task.attributes),
    };
  });
};

/**
 * @param {object} parameters the parameters for the function
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

  return twilioExecute(context, async (client) => {
    try {
      return await client.taskrouter.v1
        .workspaces(process.env.TWILIO_FLEX_WORKSPACE_SID)
        .tasks(taskSid)
        .update({ assignmentStatus: 'completed', reason });
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
        return error.message;
      }
      throw error;
    }
  });
};

/**
 * @param {object} parameters the parameters for the function
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

  return twilioExecute(context, async (client) => {
    try {
      return await client.taskrouter.v1
        .workspaces(process.env.TWILIO_FLEX_WORKSPACE_SID)
        .tasks(taskSid)
        .reservations(reservationSid)
        .update({ reservationStatus: status });
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
        console.warn(`${context.PATH}.updateReservation(): ${error.message}`);
        return error.message;
      }
      throw error;
    }
  });
};

/**
 * @param {object} parameters the parameters for the function
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.workflowSid the workflow to submit the task
 * @param {string} parameters.taskChannel the task channel to submit the task on
 * @param {object} parameters.attributes the attributes applied to the task
 * @param {string} parameters.virtualStartTime the start time to use for task ordering
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
    virtualStartTime,
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

  const createParams = {
    attributes: JSON.stringify(attributes),
    workflowSid,
    taskChannel,
    priority,
    timeout,
  };

  if (virtualStartTime) {
    createParams.virtualStartTime = virtualStartTime;
  }

  return twilioExecute(context, async (client) => {
    const task = await client.taskrouter.v1
      .workspaces(process.env.TWILIO_FLEX_WORKSPACE_SID)
      .tasks.create(createParams);
    return {
      ...task,
      attributes: JSON.parse(task.attributes),
    };
  });
};

/**
 * @param {object} parameters the parameters for the function
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.workerSid the worker SID to update
 * @param {object} parameters.attributesUpdate the object containing new attributes
 * @returns {object} worker attributes object
 * @description the following method is used to robustly update
 *   worker attributes
 */
exports.updateWorkerAttributes = async function updateWorkerAttributes(parameters) {
  const { context, workerSid, attributesUpdate } = parameters;

  if (!isObject(context)) throw new Error('Invalid parameters object passed. Parameters must contain context object');
  if (!isString(workerSid))
    throw new Error('Invalid parameters object passed. Parameters must contain workerSid string');
  if (!isString(attributesUpdate))
    throw new Error('Invalid parameters object passed. Parameters must contain attributes Json string');

  const worker = await twilioExecute(context, (client) =>
    client.taskrouter.v1.workspaces(process.env.TWILIO_FLEX_WORKSPACE_SID).workers(workerSid).fetch(),
  );

  if (!worker.success) {
    return {
      success: false,
      status: 400,
    };
  }

  const newAttributes = {
    ...JSON.parse(worker.data.attributes),
    ...JSON.parse(attributesUpdate),
  };

  return twilioExecute(context, (client) =>
    client.taskrouter.v1
      .workspaces(process.env.TWILIO_FLEX_WORKSPACE_SID)
      .workers(workerSid)
      .update({ attributes: JSON.stringify(newAttributes) }),
  );
};

/**
 * @param {object} parameters the parameters for the function
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

  return twilioExecute(context, async (client) => {
    try {
      const task = await client.taskrouter.v1
        .workspaces(process.env.TWILIO_FLEX_WORKSPACE_SID)
        .tasks(taskSid)
        .update(updateParams);

      return {
        ...task,
        attributes: JSON.parse(task.attributes),
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
        return error.message;
      }
      throw error;
    }
  });
};

/**
 * @param {object} parameters the parameters for the function
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

  return twilioExecute(context, async (client) => {
    try {
      const task = await client.taskrouter.v1.workspaces(process.env.TWILIO_FLEX_WORKSPACE_SID).tasks(taskSid).fetch();

      return {
        ...task,
        attributes: JSON.parse(task.attributes),
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
        return error.message;
      }
      throw error;
    }
  });
};

/**
 * @param {object} parameters the parameters for the function
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

  return twilioExecute(context, async (client) => {
    const tasks = await client.taskrouter.v1
      .workspaces(process.env.TWILIO_FLEX_WORKSPACE_SID)
      .tasks.list({ limit, workflowSid, assignmentStatus, ordering });

    return tasks.map((task) => ({
      ...task,
      attributes: JSON.parse(task.attributes),
    }));
  });
};
