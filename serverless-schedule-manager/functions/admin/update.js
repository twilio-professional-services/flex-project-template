const { prepareFlexFunction } = require(Runtime.getFunctions()["common/helpers/prepare-function"].path);
const ServerlessOperations = require(Runtime.getFunctions()['common/twilio-wrappers/serverless'].path);

const requiredParameters = [
  { key: 'data', purpose: 'data to save' },
  { key: 'version', purpose: 'asset version SID that is being updated, so that multiple users making updates do not accidentally overwrite each other' }
];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  
  const assetPath = '/config.json';
  
  const { data, version, TokenResult } = event;
  
  if (TokenResult.roles.indexOf('admin') < 0) {
    response.setStatusCode(403);
    response.setBody("Not authorized");
    callback(null, response);
    return;
  }
  
  try {
    // get latest build
    const latestBuildResult = await ServerlessOperations.fetchLatestBuild({ context, attempts: 0 });
    
    if (!latestBuildResult.success) {
      response.setStatusCode(latestBuildResult.status);
      response.setBody({ message: latestBuildResult.message });
      callback(null, response);
      return;
    }
    
    const { latestBuild } = latestBuildResult;
    
    // compare latest asset version sid to provided version sid
    const assetVersion = latestBuild.assetVersions.find(asset => asset.path == assetPath);
    
    if (!assetVersion) {
      // error, no asset to update
      callback('Missing asset from latest build');
      return;
    }
    
    if (assetVersion.sid != version) {
      // error, someone else made an update
      response.setStatusCode(409);
      response.setBody("Provided version SID is not the latest deployed asset version SID");
      callback(null, response);
      return;
    }
    
    // upload new asset version
    const uploadResult = await ServerlessOperations.uploadAsset({
      context,
      attempts: 0,
      assetSid: assetVersion.asset_sid,
      assetPath,
      assetData: data
    });
    
    if (!uploadResult.success) {
      response.setStatusCode(uploadResult.status);
      response.setBody({ message: uploadResult.message });
      callback(null, response);
      return;
    }
      
    const newVersionSid = uploadResult.assetVersionSid;
    
    // create new build with the new asset, but with functions and dependencies from the latest build
    const assetVersions = [ newVersionSid ];
    const functionVersions = latestBuild.functionVersions.map(version => version.sid);
    const dependencies = latestBuild.dependencies;
    
    const buildResult = await ServerlessOperations.createBuild({ context, attempts: 0, assetVersions, dependencies, functionVersions });
    
    response.setStatusCode(buildResult.status);
    response.setBody(buildResult);
    callback(null, response);
  } catch (error) {
    handleError(error);
  }
});