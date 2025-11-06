import axios from 'axios';
import semver from 'semver';
import shell from 'shelljs';

import { varNameMapping } from "./common/constants.mjs";
import { isMatch } from "./common/fetch-cli.mjs";

const regionUrl = process.env.TWILIO_REGION ? `${process.env.TWILIO_REGION}.twilio.com` : 'twilio.com';

// The list of environment variables required for a successful deployment
const REQUIRED_ENV_VARS = ["ENVIRONMENT", "TWILIO_API_KEY", "TWILIO_API_SECRET", "TWILIO_ACCOUNT_SID"];

// As documented, we support currently-maintained versions of Flex UI 2.x only
// This value should be incremented over time as we drop support for older versions
const VALID_UI_VERSIONS = '>=2.5.0';

const validateEnvVarsPresent = () => {
  let valid = true;
  
  for (const envVar of REQUIRED_ENV_VARS) {
    if (!process.env[envVar]) {
      console.log(`❌ Error: Missing environment variable '${envVar}'`);
      valid = false;
    }
  }
  
  if (valid) {
    console.log('✅ All required environment variables are present');
  } else {
    process.exitCode = 1;
  }
  
  return valid;
}

const validateEnvName = () => {
  if (!process.env.ENVIRONMENT.includes('/')) {
    console.log('✅ No invalid characters detected in environment name');
    return;
  }
  
  console.log(`❌ Error: Environment name includes invalid character '/'`);
  process.exitCode = 1;
}

const getFlexConfig = async () => {
  try {
    const flexConfigResponse = await axios.get(`https://flex-api.${regionUrl}/v1/Configuration`, {
      auth: {
        username: process.env.TWILIO_API_KEY,
        password: process.env.TWILIO_API_SECRET
      }
    });
    
    if (flexConfigResponse?.data) {
      return flexConfigResponse.data;
    }
    
    console.log('❌ Error fetching Flex config: data is missing');
  } catch (error) {
    if (error?.response?.status === 401) {
      console.log(`❌ Error: Invalid TWILIO_API_KEY or TWILIO_API_SECRET`);
    } else {
      console.log(`❌ Error fetching Flex config: ${error}`);
    }
  }
  process.exitCode = 1;
  return false;
}

const validateAccountSid = (flexConfig) => {
  if (flexConfig.account_sid === process.env.TWILIO_ACCOUNT_SID) {
    console.log('✅ API key matches provided Flex account SID');
    return;
  }
  
  console.log('❌ Error: API key does not match the provided Flex account SID or this is not a Flex account');
  process.exitCode = 1;
}

const validateUiVersion = (flexConfig) => {
  if (semver.intersects(flexConfig.ui_version.replace('.n', '.*').replace('.auto', '.*'), VALID_UI_VERSIONS)) {
    console.log(`✅ Flex UI version ${flexConfig.ui_version} is supported`);
    return;
  }
  
  console.log(`❌ Error: Configured Flex UI version is not ${VALID_UI_VERSIONS}. Please update your Flex UI version from Flex Admin and try again.`);
  process.exitCode = 1;
}

const validateTaskRouterWorkspace = (flexConfig) => {
  const workspaceResultsRaw = shell.exec(`twilio api:taskrouter:v1:workspaces:fetch --sid=${flexConfig.taskrouter_workspace_sid} -o json`, {silent: true});
  
  if (workspaceResultsRaw.code !== 0 || !workspaceResultsRaw.stdout) {
    console.log('❌ Error: Unable to retrieve the configured TaskRouter workspace');
    process.exitCode = 1;
    return;
  }
  
  try {
    const workspaceResults = JSON.parse(workspaceResultsRaw.stdout);
    
    if (workspaceResults.length < 1) {
      console.log('❌ Error: No results for the configured TaskRouter workspace SID');
      process.exitCode = 1;
      return;
    }
    
    const workspace = workspaceResults[0];
    
    if (isMatch(varNameMapping.TWILIO_FLEX_WORKSPACE_SID.name, workspace.friendlyName)) {
      console.log(`✅ Flex TaskRouter workspace is named '${workspace.friendlyName}'`);
      return;
    }
    
    console.log(`❌ Error: Flex TaskRouter workspace name is '${workspace.friendlyName}'. Please rename the workspace to the expected value, '${varNameMapping.TWILIO_FLEX_WORKSPACE_SID.name}'.`);
    process.exitCode = 1;
  } catch (error) {
    console.log(`❌ Error: Unable to parse Twilio CLI output from TaskRouter workspace fetch: ${error}`);
    process.exitCode = 1;
  }
}

const validateFlexConfig = async () => {
  const flexConfig = await getFlexConfig();
  
  if (!flexConfig) {
    return;
  }
  
  validateAccountSid(flexConfig);
  validateUiVersion(flexConfig);
  validateTaskRouterWorkspace(flexConfig);
}

if (validateEnvVarsPresent()) {
  validateEnvName();
  validateFlexConfig();
}