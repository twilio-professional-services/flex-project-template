import { promises as fs } from 'fs';
import shell from 'shelljs';

import constants from "./constants.js";
import * as fetchEnvironment from "./fetch-environment.js";

// Initialize env file if necessary, then parse its contents
const readEnv = async (envFile, exampleFile) => {
  if (!shell.test('-e', exampleFile) && !shell.test('-e', envFile)) {
    // nothing exists!
    return null;
  } else if (!shell.test('-e', envFile)) {
    // create env file based on example
    shell.cp(exampleFile, envFile);
    
    // verify creation succeeded
    if (!shell.test('-e', envFile)) {
      return null;
    }
  }
  
  // read and parse the env file
  const initialEnv = await fs.readFile(envFile, "utf8");
  let result = {};
  for (const match of initialEnv.matchAll(/<YOUR_(.*)>/g)) {
    result[match[1]] = match[0];
  }
  return result;
}

// Fills placeholder variables from process.env if present
const fillKnownEnvVars = (envVars) => {
  for (const key in envVars) {
    // If this isn't a placeholder value, ignore it
    if (envVars[key] !== `<YOUR_${key}>`) {
      continue;
    }
    
    if (process.env[key]) {
      // Hey, we were handed this var on a golden platter! Use it.
      envVars[key] = process.env[key];
    }
  }
  
  return envVars;
}

// For vars still unknown, fetches needed vars from the API and fills in as appropriate
const fillUnknownEnvVars = (envVars, environment) => {
  for (const key in envVars) {
    if (envVars[key] !== `<YOUR_${key}>` || !constants.varNameMapping[key]) {
      // If this isn't a placeholder value, ignore it.
      // This variable isn't in the constant, so we can't do anything else with it.
      continue;
    }
    
    if (fetchEnvironment.getFetchedVars()[key]) {
      // This value was cached previously
      envVars[key] = fetchEnvironment.getFetchedVars()[key];
      continue;
    }
    
    if (!environment && constants.varNameMapping[key].localValue) {
      // Running locally, use the local value if specified
      envVars[key] = constants.varNameMapping[key].localValue;
      continue;
    }
    
    // we haven't yet fetched the value; do that based on type
    switch (constants.varNameMapping[key].type) {
      case "serverless-domain":
      fetchEnvironment.fetchServerlessDomains();
      break;
      case "tr-workspace":
      fetchEnvironment.fetchTrWorkspaces();
      break;
      case "tr-workflow":
      // Workflows require the TR workspace SID; fetch them if that has not yet happened
      if (!fetchEnvironment.getFetchedVars().TWILIO_FLEX_WORKSPACE_SID) {
        fetchEnvironment.fetchTrWorkspaces();
      }
      let workspaceSid = fetchEnvironment.getFetchedVars().TWILIO_FLEX_WORKSPACE_SID;
      fetchEnvironment.fetchTrWorkflows(workspaceSid);
      break;
      case "sync-service":
      fetchEnvironment.fetchSyncServices();
      break;
      case "chat-service":
      fetchEnvironment.fetchChatServices();
      break;
      default:
      console.warn(`Unknown placeholder variable type: ${constants.varNameMapping[key].type}`);
      break;
    }
    
    // Get the newly fetched value from cache
    if (fetchEnvironment.getFetchedVars()[key]) {
      envVars[key] = fetchEnvironment.getFetchedVars()[key];
    }
  }
  
  return envVars;
}

const fillAccountVars = (envVars, account) => {
  for (const key in envVars) {
    if (envVars[key] !== `<YOUR_${key}>`) {
      // If this isn't a placeholder value, ignore it.
      continue;
    }
    
    if ((key == 'ACCOUNT_SID') && account.accountSid) {
      envVars[key] = account.accountSid;
    } else if (key == 'AUTH_TOKEN' && account.authToken) {
      envVars[key] = account.authToken;
    }
  }
  
  return envVars;
}

export default async (path, examplePath, account, environment) => {
  try {
    // Initialize the env vars
    let envVars = await readEnv(path, examplePath);
    
    if (!envVars) {
      console.error(`Unable to create the environment file ${path}.`);
      return null;
    }
    
    // Fill known env vars from process.env
    envVars = fillKnownEnvVars(envVars);
    
    // Fill known account vars
    envVars = fillAccountVars(envVars, account);
    
    // Fetch unknown env vars from the API
    envVars = fillUnknownEnvVars(envVars, environment);
    
    return envVars;
  } catch (error) {
    console.error('Error fetching environment variables', error);
    return null;
  }
}