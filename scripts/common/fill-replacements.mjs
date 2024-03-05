import { promises as fs } from 'fs';
import shell from 'shelljs';

import { placeholderPrefix, varNameMapping } from "./constants.mjs";
import * as fetchCli from "./fetch-cli.mjs";

const parseData = (data) => {
  let result = {};
  for (const match of data.matchAll(new RegExp(`<${placeholderPrefix}_(.*)>`, 'g'))) {
    result[match[1]] = match[0];
  }
  return result;
}

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
  return parseData(initialEnv);
}

// Fills placeholder variables from process.env if present
const fillKnownEnvVars = (envVars) => {
  for (const key in envVars) {
    // If this isn't a placeholder value, ignore it
    if (envVars[key] !== `<${placeholderPrefix}_${key}>`) {
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
  if (envVars[key] !== `<${placeholderPrefix}_${key}>` || !varNameMapping[key]) {
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
      envVars[parentKey] = `<${placeholderPrefix}_${parentKey}>`;
    }
    fillVar(parentKey, envVars, environment);
    if (envVars[parentKey] === `<${placeholderPrefix}_${parentKey}>`) {
      // if we couldn't populate the parent, we definitely can't fetch this
      return;
    }
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
    if (envVars[key] !== `<${placeholderPrefix}_${key}>`) {
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

const fillAllVars = (envVars, account, environment) => {
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
  
  return envVars;
}

const saveReplacements = async (data, path) => {
  try {
    for (const key in data) {
      shell.sed('-i', new RegExp(`<${placeholderPrefix}_${key}>`, 'g'), data[key], path);
    }
  } catch (error) {
    console.error(`Error saving file ${path}`, error);
  }
}

// Function to use for generating a populated string from a string containing placeholders
export const fillReplacementsForString = async (data, account, environment) => {
  // Parse out the env vars from the string
  let envVars = parseData(data);
  
  if (!envVars) {
    console.error(`Error parsing data`, error);
    return null;
  }
  
  // Fill the envVars with the appropriate replacements
  envVars = fillAllVars(envVars, account, environment);
  
  if (!envVars) {
    return null;
  }
  
  // Replace the placeholders with the filled vars
  let newData = data;
  for (const key in envVars) {
    newData = newData.replace(new RegExp(`<${placeholderPrefix}_${key}>`, 'g'), envVars[key]);
  }
  
  return {
    data: newData,
    envVars,
  };
}

// Function to use for generating a populated file based on an example file containing placeholders
export const fillReplacementsForPath = async (path, examplePath, account, environment, overwrite) => {
  // Check if this package uses environment files
  if (!shell.test('-e', examplePath) && !shell.test('-e', path)) {
    // No environment files, no need to continue
    return null;
  }
  
  // Parse out the env vars from the file
  let envVars = await readEnv(path, examplePath, overwrite);
  
  if (!envVars) {
    console.error(`Unable to create the file ${path}.`);
    return null;
  }
  
  // Fill the envVars with the appropriate replacements
  envVars = fillAllVars(envVars, account, environment);
  
  if (!envVars) {
    return null;
  }
  
  // Save!
  await saveReplacements(envVars, path);
  
  return envVars;
}

export default fillReplacementsForPath;