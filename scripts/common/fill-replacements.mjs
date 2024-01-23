import { promises as fs } from 'fs';
import shell from 'shelljs';

import { varNameMapping } from "./constants.mjs";
import * as fetchCli from "./fetch-cli.mjs";

// Initialize env file if necessary, then parse its contents
const readEnv = async (envFile, exampleFile, overwrite) => {
  if (overwrite || !shell.test('-e', envFile)) {
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

const fillVar = (key, envVars, environment) => {
  if (envVars[key] !== `<YOUR_${key}>` || !varNameMapping[key]) {
    // If this isn't a placeholder value, ignore it.
    // This variable isn't in the constant, so we can't do anything else with it.
    return;
  }
  
  if (fetchCli.getFetchedVars()[key]) {
    // This value was cached previously
    envVars[key] = fetchCli.getFetchedVars()[key];
    return;
  }
  
  if ((!environment || environment === 'local') && varNameMapping[key].localValue) {
    // Running locally, use the local value if specified
    envVars[key] = varNameMapping[key].localValue;
    return;
  }
  
  // we haven't yet fetched the value!
  
  // if the mapping has a parent defined, ensure we have fetched that first
  const parentKey = varNameMapping[key].parent;
  if (parentKey) {
    // if this key is not in the env vars, add it so that it can be referenced
    if (!envVars[parentKey]) {
      envVars[parentKey] = `<YOUR_${parentKey}>`;
    }
    fillVar(parentKey, envVars, environment);
  }
  
  // fetch the value based on type
  switch (varNameMapping[key].type) {
    case "serverless-domain":
    fetchCli.fetchServerlessDomains();
    break;
    case "serverless-service":
    fetchCli.fetchServerlessServices();
    break;
    case "serverless-environment":
    fetchCli.fetchServerlessEnvironments(envVars[parentKey]);
    break;
    case "serverless-function":
    fetchCli.fetchServerlessFunctions(envVars[parentKey]);
    break;
    case "tr-workspace":
    fetchCli.fetchTrWorkspaces();
    break;
    case "tr-workflow":
    fetchCli.fetchTrWorkflows(envVars[parentKey]);
    break;
    case "sync-service":
    fetchCli.fetchSyncServices();
    break;
    case "chat-service":
    fetchCli.fetchChatServices();
    break;
    default:
    console.warn(`Unknown placeholder variable type: ${varNameMapping[key].type}`);
    break;
  }
  
  // Get the newly fetched value from cache
  if (fetchCli.getFetchedVars()[key]) {
    envVars[key] = fetchCli.getFetchedVars()[key];
  }
}

// For vars still unknown, fetches needed vars from the API and fills in as appropriate
const fillUnknownEnvVars = (envVars, environment) => {
  for (const key in envVars) {
    fillVar(key, envVars, environment);
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
    } else if (key == 'TWILIO_API_KEY' && account.apiKey) {
      envVars[key] = account.apiKey;
    } else if (key == 'TWILIO_API_SECRET' && account.apiSecret) {
      envVars[key] = account.apiSecret;
    }
  }
  
  return envVars;
}

const saveReplacements = async (data, path) => {
  try {
    for (const key in data) {
      shell.sed('-i', new RegExp(`<YOUR_${key}>`, 'g'), data[key], path);
    }
  } catch (error) {
    console.error(`Error saving file ${path}`, error);
  }
}

export default async (path, examplePath, account, environment, overwrite) => {
  console.log(`Setting up ${path}...`);
  
  // Check if this package uses environment files
  if (!shell.test('-e', examplePath) && !shell.test('-e', path)) {
    // No environment files, no need to continue
    return null;
  }
  
  // Initialize the env vars
  let envVars = await readEnv(path, examplePath, overwrite);
  
  if (!envVars) {
    console.error(`Unable to create the file ${path}.`);
    return null;
  }
  
  try {
    // Fill known env vars from process.env
    envVars = fillKnownEnvVars(envVars);
    
    // Fill known account vars
    envVars = fillAccountVars(envVars, account);
  } catch (error) {
    console.error('Error fetching variables', error);
    return null;
  }
  
  // Fetch unknown env vars from the API
  envVars = fillUnknownEnvVars(envVars, environment);
  
  // Save!
  await saveReplacements(envVars, path);
  
  return envVars;
}