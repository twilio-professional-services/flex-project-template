const { prepareFlexFunction, extractStandardResponse } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);
const TaskRouterOperations = require(Runtime.getFunctions()['common/twilio-wrappers/taskrouter'].path);
const { buildTargetExpression } = require(Runtime.getFunctions()[
  'features/mass-worker-update/common/build-target-expression'
].path);

const requiredParameters = [];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    if (!event.TokenResult.roles.includes('admin')) {
      response.setStatusCode(403);
      response.setBody({ success: false, error: 'User does not have the permissions to perform this action.' });
      return callback(null, response);
    }

    const { team, department, skill, limit } = event;

    let targetWorkersExpression;
    try {
      targetWorkersExpression = buildTargetExpression({ team, department, skill });
    } catch (err) {
      response.setStatusCode(400);
      response.setBody({ success: false, error: err.message });
      return callback(null, response);
    }

    const result = await TaskRouterOperations.listWorkers({
      context,
      targetWorkersExpression,
      limit: limit ? Number(limit) : 1000,
    });

    const workers = (result.data || []).map((worker) => {
      const fullName =
        typeof worker.attributes?.full_name === 'string' && worker.attributes.full_name.length > 0
          ? worker.attributes.full_name
          : null;
      return {
        sid: worker.sid,
        friendlyName: worker.friendlyName,
        fullName,
        teamName: worker.attributes?.team_name || null,
        departmentName: worker.attributes?.department_name || null,
        skills: worker.attributes?.routing?.skills || [],
      };
    });

    response.setStatusCode(result.status);
    response.setBody({
      workers,
      count: workers.length,
      targetWorkersExpression,
      ...extractStandardResponse(result),
    });
    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
