const { isString, isObject, isNumber, isArray } = require('lodash');
const FormData = require('form-data');
const axios = require('axios');

const retryHandler = require(Runtime.getFunctions()['common/helpers/retry-handler'].path).retryHandler;

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.buildSid the build to be deployed
 * @returns {object} An object containing the deployment sid
 * @description the following method is used to deploy a given build in this environment
 */
exports.deployBuild = async (parameters) => {
  const { attempts, context, buildSid } = parameters;

  if (!isNumber(attempts))
    throw new Error('Invalid parameters object passed. Parameters must contain the number of attempts');
  if (!isObject(context)) throw new Error('Invalid parameters object passed. Parameters must contain context object');
  if (!isString(buildSid)) throw new Error('Invalid parameters object passed. Parameters must contain buildSid string');

  try {
    const client = context.getTwilioClient();

    const envSid = context.ENVIRONMENT_SID;
    const serviceSid = context.SERVICE_SID;

    const deployment = await client.serverless.v1
      .services(serviceSid)
      .environments(envSid)
      .deployments.create({ buildSid });

    return { success: true, status: 200, deploymentSid: deployment.sid };
  } catch (error) {
    return retryHandler(error, parameters, exports.deployBuild);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.buildSid the build SID to check status for
 * @returns {object} An object containing the deployment sid
 * @description the following method is used to fetch build status for this service
 */
exports.fetchBuildStatus = async (parameters) => {
  const { attempts, context, buildSid } = parameters;

  if (!isNumber(attempts))
    throw new Error('Invalid parameters object passed. Parameters must contain the number of attempts');
  if (!isObject(context)) throw new Error('Invalid parameters object passed. Parameters must contain context object');
  if (!isString(buildSid)) throw new Error('Invalid parameters object passed. Parameters must contain buildSid string');

  try {
    const client = context.getTwilioClient();

    const serviceSid = context.SERVICE_SID;

    const build = await client.serverless.v1.services(serviceSid).builds(buildSid).buildStatus().fetch();

    if (!build) {
      // error, no builds
      return { success: false, status: 400, message: 'Build not found' };
    }

    return { success: true, status: 200, buildStatus: build.status };
  } catch (error) {
    return retryHandler(error, parameters, exports.fetchBuildStatus);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @returns {object} An object containing the deployment sid
 * @description the following method is used to fetch the latest build for this service
 */
exports.fetchLatestBuild = async (parameters) => {
  const { attempts, context } = parameters;

  if (!isNumber(attempts))
    throw new Error('Invalid parameters object passed. Parameters must contain the number of attempts');
  if (!isObject(context)) throw new Error('Invalid parameters object passed. Parameters must contain context object');

  try {
    const client = context.getTwilioClient();

    const serviceSid = context.SERVICE_SID;

    const builds = await client.serverless.v1.services(serviceSid).builds.list({ limit: 1 });

    if (builds.length < 1) {
      // error, no builds
      return { success: false, status: 400, message: 'No builds found' };
    }

    return { success: true, status: 200, latestBuild: builds[0] };
  } catch (error) {
    return retryHandler(error, parameters, exports.fetchLatestBuild);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @returns {object} The latest deployment
 * @description the following method is used to fetch the latest deployment for this service
 */
exports.fetchLatestDeployment = async (parameters) => {
  const { attempts, context } = parameters;

  if (!isNumber(attempts))
    throw new Error('Invalid parameters object passed. Parameters must contain the number of attempts');
  if (!isObject(context)) throw new Error('Invalid parameters object passed. Parameters must contain context object');

  try {
    const client = context.getTwilioClient();

    const envSid = context.ENVIRONMENT_SID;
    const serviceSid = context.SERVICE_SID;

    const deployments = await client.serverless.v1
      .services(serviceSid)
      .environments(envSid)
      .deployments.list({ limit: 1 });

    if (deployments.length < 1) {
      // error, no deployments. this should be impossible when running while deployed!
      return { success: false, status: 400, message: 'No deployments found' };
    }

    return { success: true, status: 200, latestDeployment: deployments[0] };
  } catch (error) {
    return retryHandler(error, parameters, exports.fetchLatestDeployment);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {array} parameters.assetVersions the asset versions to include in this build
 * @param {array} parameters.dependencies the dependencies to include in this build
 * @param {array} parameters.functionVersions the function versions to include in this build
 * @returns {object} An object containing the build sid
 * @description the following method is used to create a new build in this service
 */
exports.createBuild = async (parameters) => {
  const { attempts, context, assetVersions, dependencies, functionVersions } = parameters;

  if (!isNumber(attempts))
    throw new Error('Invalid parameters object passed. Parameters must contain the number of attempts');
  if (!isObject(context)) throw new Error('Invalid parameters object passed. Parameters must contain context object');
  if (!isArray(assetVersions))
    throw new Error('Invalid parameters object passed. Parameters must contain assetVersions array');
  if (!isArray(dependencies))
    throw new Error('Invalid parameters object passed. Parameters must contain dependencies array');
  if (!isArray(functionVersions))
    throw new Error('Invalid parameters object passed. Parameters must contain functionVersions array');

  try {
    const client = context.getTwilioClient();

    const serviceSid = context.SERVICE_SID;
    const dependenciesStr = JSON.stringify(dependencies);

    const build = await client.serverless.v1
      .services(serviceSid)
      .builds.create({ assetVersions, dependencies: dependenciesStr, functionVersions });

    return { success: true, status: 200, buildSid: build.sid };
  } catch (error) {
    return retryHandler(error, parameters, exports.createBuild);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.assetSid the asset versions to include in this build
 * @param {string} parameters.assetPath the dependencies to include in this build
 * @param {object} parameters.assetData the function versions to include in this build
 * @returns {object} An object containing the new asset version sid
 * @description the following method is used to upload a new version of an asset in this service
 */
exports.uploadAsset = async (parameters) => {
  const { attempts, context, assetSid, assetPath, assetData } = parameters;

  if (!isNumber(attempts))
    throw new Error('Invalid parameters object passed. Parameters must contain the number of attempts');
  if (!isObject(context)) throw new Error('Invalid parameters object passed. Parameters must contain context object');
  if (!isString(assetSid)) throw new Error('Invalid parameters object passed. Parameters must contain assetSid string');
  if (!isString(assetPath))
    throw new Error('Invalid parameters object passed. Parameters must contain assetPath string');
  if (!isObject(assetData))
    throw new Error('Invalid parameters object passed. Parameters must contain assetData object');

  try {
    const apiKey = context.ACCOUNT_SID;
    const apiSecret = context.AUTH_TOKEN;
    const serviceSid = context.SERVICE_SID;

    // set upload parameters
    const uploadUrl = `https://serverless-upload.twilio.com/v1/Services/${serviceSid}/Assets/${assetSid}/Versions`;

    const form = new FormData();
    form.append('Path', assetPath);
    form.append('Visibility', 'private');
    form.append('Content', JSON.stringify(assetData), {
      contentType: 'application/json',
    });

    // create a new asset version
    const uploadResponse = await axios.post(uploadUrl, form, {
      auth: {
        username: apiKey,
        password: apiSecret,
      },
      headers: form.getHeaders(),
    });

    if (!uploadResponse.data) {
      return { success: false, status: 500, message: 'Missing data in response' };
    }

    const newVersionSid = uploadResponse.data.sid;

    if (!newVersionSid) {
      return { success: false, status: 500, message: 'Missing new version SID in response' };
    }

    return { success: true, status: 200, assetVersionSid: newVersionSid };
  } catch (error) {
    return retryHandler(error, parameters, exports.uploadAsset);
  }
};
