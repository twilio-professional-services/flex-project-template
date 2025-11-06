const { prepareFlexFunction, extractStandardResponse } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);
const ScheduleUtils = require(Runtime.getFunctions()['common/helpers/schedule-utils'].path);
const ServerlessOperations = require(Runtime.getFunctions()['common/twilio-wrappers/serverless'].path);

const requiredParameters = [];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  const assetPath = '/config.json';

  // load data
  const openData = Runtime.getAssets()[assetPath].open;
  const data = JSON.parse(openData());

  try {
    // get latest build
    // this is so we can provide a version sid in the response to avoid racing with multiple users updating config.
    // when updating the config, the client provides the sid, and we will only save if it matches the latest one.

    const latestBuildResult = await ServerlessOperations.fetchLatestBuild({ context, attempts: 0 });

    if (!latestBuildResult.success) {
      response.setStatusCode(latestBuildResult.status);
      response.setBody({ ...extractStandardResponse(latestBuildResult) });
      return callback(null, response);
    }

    const { latestBuild } = latestBuildResult;

    // get the data asset version sid from the latest build
    const version = latestBuild.assetVersions.find((asset) => asset.path === assetPath)?.sid;

    if (!version) {
      // error, no data asset in latest build
      return callback('Missing asset in latest build');
    }

    // now validate that this build is what is deployed
    const latestDeploymentResult = await ServerlessOperations.fetchLatestDeployment({ context, attempts: 0 });

    if (!latestDeploymentResult.success) {
      response.setStatusCode(latestDeploymentResult.status);
      response.setBody({ ...extractStandardResponse(latestDeploymentResult) });
      return callback(null, response);
    }

    const { latestDeployment } = latestDeploymentResult;

    const versionIsDeployed = latestDeployment.buildSid === latestBuild.sid;

    // for each schedule in data, evaluate the schedule and add to the response payload
    if (data.schedules) {
      data.schedules.forEach((schedule) => {
        schedule.status = ScheduleUtils.evaluateSchedule(schedule.name);
      });
    }

    // return config data plus version data
    const returnData = {
      data,
      version,
      versionIsDeployed,
    };

    response.setBody(returnData);
    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
