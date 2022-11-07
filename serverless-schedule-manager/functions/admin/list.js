const TokenValidator = require('twilio-flex-token-validator').functionValidator;
const ScheduleUtils = require(Runtime.getFunctions()['common/helpers/schedule-utils'].path);
const ServerlessOperations = require(Runtime.getFunctions()['common/twilio-wrappers/serverless'].path);

exports.handler = TokenValidator(async function list(context, event, callback) {
  const scriptName = arguments.callee.name;
  const response = new Twilio.Response();
  response.appendHeader('Access-Control-Allow-Origin', '*');
  response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS GET');
  response.appendHeader('Content-Type', 'application/json');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  const assetPath = '/config.json';
  
  // load data
  const openData = Runtime.getAssets()[assetPath].open;
  const data = JSON.parse(openData());
  
  try {
    // get latest build
    // this is so we can provide a version sid in the response to avoid racing with multiple users updating config.
    // when updating the config, the client provides the sid, and we will only save if it matches the latest one.
    
    const latestBuildResult = await ServerlessOperations.fetchLatestBuild({ scriptName, context, attempts: 0 });
    
    if (!latestBuildResult.success) {
      response.setStatusCode(latestBuildResult.status);
      response.setBody({ message: latestBuildResult.message });
      callback(null, response);
      return;
    }
    
    const { latestBuild } = latestBuildResult;
    
    // get the data asset version sid from the latest build
    const version = latestBuild.assetVersions.find(asset => asset.path == assetPath)?.sid;
    
    if (!version) {
      // error, no data asset in latest build
      callback('Missing asset in latest build');
      return;
    }
    
    // now validate that this build is what is deployed
    const latestDeploymentResult = await ServerlessOperations.fetchLatestDeployment({ scriptName, context, attempts: 0 });
    
    if (!latestDeploymentResult.success) {
      response.setStatusCode(latestDeploymentResult.status);
      response.setBody({ message: latestDeploymentResult.message });
      callback(null, response);
      return;
    }
    
    const { latestDeployment } = latestDeploymentResult;
    
    const versionIsDeployed = latestDeployment.buildSid === latestBuild.sid;
    
    // for each schedule in data, evaluate the schedule and add to the response payload
    if (data.schedules) {
      data.schedules.forEach(schedule => {
        schedule.status = ScheduleUtils.evaluateSchedule(schedule.name);
      });
    }
    
    // return config data plus version data
    const returnData = {
      data,
      version,
      versionIsDeployed
    };
    
    response.setBody(returnData);
    callback(null, response);
  } catch (error) {
    console.log('Error executing function', error)
    callback(error);
  }
});
