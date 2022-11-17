const { merge, isString, isObject, isNumber, isBoolean } = require("lodash");

const retryHandler = require(Runtime.getFunctions()[
  "common/twilio-wrappers/retry-handler"
].path).retryHandler;

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
  const { attempts, taskSid, attributesUpdate } = parameters;

  if (!isNumber(attempts))
    throw "Invalid parameters object passed. Parameters must contain the number of attempts";
  if (!isString(taskSid))
    throw "Invalid parameters object passed. Parameters must contain the taskSid string";
  if (!isString(attributesUpdate))
    throw "Invalid parameters object passed. Parameters must contain attributesUpdate JSON string";

  try {
    const axios = require("axios");

    const taskContextURL = `https://taskrouter.twilio.com/v1/Workspaces/${process.env.TWILIO_FLEX_WORKSPACE_SID}/Tasks/${taskSid}`;
    let config = {
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
    let updatedTaskAttributes = merge(
      {},
      task.attributes,
      JSON.parse(attributesUpdate)
    );

    // if-match the revision number to ensure
    // no update collisions
    config.headers = {
      "If-Match": task.revision,
      "content-type": "application/x-www-form-urlencoded",
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
    return retryHandler(error, parameters, arguments.callee);
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
  const { attempts, taskSid, reason, context } = parameters;

  if (!isNumber(attempts))
    throw "Invalid parameters object passed. Parameters must contain the number of attempts";
  if (!isString(taskSid))
    throw "Invalid parameters object passed. Parameters must contain the taskSid string";
  if (!isString(reason))
    throw "Invalid parameters object passed. Parameters must contain reason string";
  if (!isObject(context))
    throw "Invalid parameters object passed. Parameters must contain reason context object";

  try {
    const client = context.getTwilioClient();

    const task = await client.taskrouter
      .workspaces(process.env.TWILIO_FLEX_WORKSPACE_SID)
      .tasks(taskSid)
      .update({ assignmentStatus: "completed", reason });

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
      const { context } = parameters;
      console.warn(
        `${context.PATH}.${arguments.callee.name}(): ${error.message}`
      );
      return {
        success: true,
        status: 200,
        message: error.message,
      };
    }
    return retryHandler(error, parameters, arguments.callee);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.taskSid the task to update
 * @param {string} parameters.reservationSid the reservation to update
 * @returns {object} an object containing the task if successful
 * @description this operation safely completes the task reservation
 */
exports.completeReservation = async function completeReservation(parameters) {
  const { attempts, context, taskSid, reservationSid } = parameters;

  if (!isNumber(attempts))
    throw "Invalid parameters object passed. Parameters must contain the number of attempts";
  if (!isString(taskSid))
    throw "Invalid parameters object passed. Parameters must contain the taskSid string";
  if (!isString(reservationSid))
    throw "Invalid parameters object passed. Parameters must contain reservationSid string";
  if (!isObject(context))
    throw "Invalid parameters object passed. Parameters must contain reason context object";

  try {
    const client = context.getTwilioClient();

    const reservation = await client.taskrouter
      .workspaces(process.env.TWILIO_FLEX_WORKSPACE_SID)
      .tasks(taskSid)
      .reservations(reservationSid)
      .update({ reservationStatus: "completed" });

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
      const { context } = parameters;
      console.warn(
        `${context.PATH}.${arguments.callee.name}(): ${error.message}`
      );
      return {
        success: true,
        status: 200,
        message: error.message,
      };
    }
    return retryHandler(error, parameters, arguments.callee);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.taskSid the task to update
 * @param {string} parameters.reservationSid the reservation to update
 * @returns {object} an object containing the task if successful
 * @description this operation safely moves the reservation to wrapup
 */
exports.wrapupReservation = async function wrapupReservation(parameters) {
  const { attempts, context, taskSid, reservationSid } = parameters;

  if (!isNumber(attempts))
    throw "Invalid parameters object passed. Parameters must contain the number of attempts";
  if (!isString(taskSid))
    throw "Invalid parameters object passed. Parameters must contain the taskSid string";
  if (!isString(reservationSid))
    throw "Invalid parameters object passed. Parameters must contain reservationSid string";
  if (!isObject(context))
    throw "Invalid parameters object passed. Parameters must contain reason context object";

  try {
    const client = context.getTwilioClient();

    const reservation = await client.taskrouter
      .workspaces(process.env.TWILIO_FLEX_WORKSPACE_SID)
      .tasks(taskSid)
      .reservations(reservationSid)
      .update({ reservationStatus: "wrapping" });

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
      const { context } = parameters;
      console.warn(
        `${context.PATH}.${arguments.callee.name}(): ${error.message}`
      );
      return {
        success: true,
        status: 200,
        message: error.message,
      };
    }
    return retryHandler(error, parameters, arguments.callee);
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
    attempts,
  } = parameters;

  if (!isNumber(attempts))
    throw "Invalid parameters object passed. Parameters must contain the number of attempts";
  if (!isObject(context))
    throw "Invalid parameters object passed. Parameters must contain context object";
  if (!isString(workflowSid) || workflowSid.length == 0)
    throw "Invalid parameters object passed. Parameters must contain workflowSid string";
  if (!isString(taskChannel) || taskChannel.length == 0)
    throw "Invalid parameters object passed. Parameters must contain taskChannel string";
  if (!isObject(attributes))
    throw "Invalid parameters object passed. Parameters must contain attributes object";

  const timeout = overriddenTimeout || 86400;
  const priority = overriddenPriority || 0;

  try {
    const client = context.getTwilioClient();
    const task = await client.taskrouter
      .workspaces(process.env.TWILIO_FLEX_WORKSPACE_SID)
      .tasks.create({
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
    return retryHandler(error, parameters, arguments.callee);
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
  const { context, attempts } = parameters;

  if (!isNumber(attempts))
    throw "Invalid parameters object passed. Parameters must contain the number of attempts";
  if (!isObject(context))
    throw "Invalid parameters object passed. Parameters must contain context object";

  try {
    const client = context.getTwilioClient();
    const queues = await client.taskrouter
      .workspaces(process.env.TWILIO_FLEX_WORKSPACE_SID)
      .taskQueues.list({ limit: 1000 });

    return {
      success: true,
      status: 200,
      queues,
    };
  } catch (error) {
    return retryHandler(error, parameters, arguments.callee);
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
  const {
    context,
    attempts,
    workerSid,
  } = parameters;

  if (!isNumber(attempts))
    throw "Invalid parameters object passed. Parameters must contain the number of attempts";
  if (!isObject(context))
    throw "Invalid parameters object passed. Parameters must contain context object";
  if (!isString(workerSid))
    throw "Invalid parameters object passed. Parameters must contain workerSid string";

  try {
    const client = context.getTwilioClient();
    const workerChannels = await client.taskrouter
      .workspaces(process.env.TWILIO_FLEX_WORKSPACE_SID)
      .workers(workerSid)
      .workerChannels
      .list();

    return {
      success: true,
      status: 200,
      workerChannels,
    };
  } catch (error) {
    return retryHandler(error, parameters, arguments.callee);
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
  const {
    context,
    attempts,
    workerSid,
    workerChannelSid,
    capacity,
    available,
  } = parameters;

  if (!isNumber(attempts))
    throw "Invalid parameters object passed. Parameters must contain the number of attempts";
  if (!isObject(context))
    throw "Invalid parameters object passed. Parameters must contain context object";
  if (!isString(workerSid))
    throw "Invalid parameters object passed. Parameters must contain workerSid string";
  if (!isString(workerChannelSid))
    throw "Invalid parameters object passed. Parameters must contain workerChannelSid string";
  if (!isNumber(capacity))
    throw "Invalid parameters object passed. Parameters must contain capacity number";
  if (!isBoolean(available))
    throw "Invalid parameters object passed. Parameters must contain available boolean";

  try {
    const client = context.getTwilioClient();
    const workerChannelCapacity = await client.taskrouter
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
    return retryHandler(error, parameters, arguments.callee);
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
  const { attempts, taskSid, updateParams, context } = parameters;

  if (!isNumber(attempts))
    throw "Invalid parameters object passed. Parameters must contain the number of attempts";
  if (!isString(taskSid))
    throw "Invalid parameters object passed. Parameters must contain the taskSid string";
  if (!isObject(updateParams))
    throw "Invalid parameters object passed. Parameters must contain updateParams object";
  if (!isObject(context))
    throw "Invalid parameters object passed. Parameters must contain reason context object";

  try {
    const client = context.getTwilioClient();

    const task = await client.taskrouter
      .workspaces(process.env.TWILIO_FLEX_WORKSPACE_SID)
      .tasks(taskSid)
      .update(updateParams);

    return {
      success: true,
      status: 200,
      task: {
        ...task,
        attributes: JSON.parse(task.attributes),
      }
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
      const { context } = parameters;
      console.warn(
        `${context.PATH}.${arguments.callee.name}(): ${error.message}`
      );
      return {
        success: true,
        status: 200,
        message: error.message,
      };
    }
    return retryHandler(error, parameters, arguments.callee);
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
  const { attempts, taskSid, context } = parameters;

  if (!isNumber(attempts))
    throw "Invalid parameters object passed. Parameters must contain the number of attempts";
  if (!isString(taskSid))
    throw "Invalid parameters object passed. Parameters must contain the taskSid string";
  if (!isObject(context))
    throw "Invalid parameters object passed. Parameters must contain reason context object";

  try {
    const client = context.getTwilioClient();

    const task = await client.taskrouter
      .workspaces(process.env.TWILIO_FLEX_WORKSPACE_SID)
      .tasks(taskSid)
      .fetch();

    return {
      success: true,
      status: 200,
      task: {
        ...task,
        attributes: JSON.parse(task.attributes),
      }
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
      const { context } = parameters;
      console.warn(
        `${context.PATH}.${arguments.callee.name}(): ${error.message}`
      );
      return {
        success: true,
        status: 200,
        message: error.message,
      };
    }
    return retryHandler(error, parameters, arguments.callee);
  }
};
