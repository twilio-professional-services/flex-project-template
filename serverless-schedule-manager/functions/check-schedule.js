const { prepareStudioFunction } = require(Runtime.getFunctions()['common/helpers/function-helper'].path);
const ScheduleUtils = require(Runtime.getFunctions()['common/helpers/schedule-utils'].path);

const requiredParameters = [{ key: 'name', purpose: 'name of the schedule to check' }];

exports.handler = prepareStudioFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const { name, simulate } = event;
    const returnData = ScheduleUtils.evaluateSchedule(name, simulate);

    if (returnData.error) {
      const { error, status } = returnData;
      response.setStatusCode(status);

      // fail open to be as graceful as possible
      response.setBody({ isOpen: true, closedReason: 'error', error });

      return callback(null, response);
    }

    console.log(`Schedule ${name} result`, returnData);
    response.setBody(returnData);
    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
