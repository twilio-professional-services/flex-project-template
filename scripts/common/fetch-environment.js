import dotenv from 'dotenv';
import { promises as fs } from 'fs';
import shell from 'shelljs';

import constants from "./constants.js";

let fetchedTypes = [];
let resultCache = {};

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
  return dotenv.parse(initialEnv);
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

// Reusable function for filtering the desired objects to fetch per type
const filterWantedVars = (type) => {
  let wanted = {};
  
  for (const varName in constants.varNameMapping) {
    if (constants.varNameMapping[varName].type !== type) {
      continue;
    }
    
    wanted[varName] = constants.varNameMapping[varName];
  }
  
  return wanted;
}

// Reusable function for running and parsing Twilio CLI command output
const execTwilioCli = (command) => {
  const outputRaw = shell.exec(command, {silent: true});
  
  if (outputRaw.code !== 0) {
    console.error("Failed to execute Twilio CLI command", outputRaw.stderr);
    return null;
  }
  
  try {
    const outputParsed = JSON.parse(outputRaw.stdout);
    return outputParsed;
  } catch (error) {
    console.error("Failed to parse Twilio CLI output", error);
    return null;
  }
}

// Reusable function for string compare including regex
const isMatch = (searchValue, valueToCheck, allowFuzz) => {
  if (searchValue instanceof RegExp) {
    return searchValue.test(valueToCheck);
  }
  
  // assume string
  
  if (allowFuzz) {
    return valueToCheck.startsWith(searchValue);
  }
  
  return valueToCheck == searchValue;
}

const fetchServerlessDomains = () => {
  const type = "serverless-domain";
  // If we already fetched these, no need to do it again
  if (fetchedTypes.includes(type)) {
    return;
  }
  
  console.log("Fetching serverless domains...");
  
  let wantedDomains = filterWantedVars(type);
  const serverlessServices = execTwilioCli("twilio api:serverless:v1:services:list -o json");
  
  if (!serverlessServices || serverlessServices.length < 1) {
    return;
  }
  
  // for each of the services we found, if it is one we are interested in, get its environments and add to the cache
  for (const service of serverlessServices) {
    for (const wanted in wantedDomains) {
      if (isMatch(wantedDomains[wanted].name, service.uniqueName, false)) {
        const serviceEnvironments = execTwilioCli(`twilio api:serverless:v1:services:environments:list --service-sid=${service.sid} -o json`);
        
        if (!serviceEnvironments || serviceEnvironments.length < 1) {
          continue;
        }
        
        resultCache[wanted] = serviceEnvironments[0].domainName;
        
        break;
      }
    }
  }
  
  fetchedTypes.push(type);
}

const fetchTrWorkflows = (workspaceSid) => {
  const type = "tr-workflow";
  // If we already fetched these, no need to do it again
  if (fetchedTypes.includes(type)) {
    return;
  }
  
  if (!workspaceSid) {
    console.warn("TaskRouter workspace SID missing; unable to fetch workflows");
    return;
  }
  
  console.log("Fetching TaskRouter workflows...");
  
  const wantedWorkflows = filterWantedVars(type);
  const workflows = execTwilioCli(`twilio api:taskrouter:v1:workspaces:workflows:list --workspace-sid=${workspaceSid} -o json`);
  
  if (!workflows || workflows.length < 1) {
    return;
  }
  
  // if the workflow was requested, save it in the cache
  for (const workflow of workflows) {
    for (const wanted in wantedWorkflows) {
      if (isMatch(wantedWorkflows[wanted].name, workflow.friendlyName, true) || isMatch(wantedWorkflows[wanted].fallback, workflow.friendlyName, true)) {
        resultCache[wanted] = workflow.sid;
        break;
      }
    }
  }
  
  fetchedTypes.push(type);
}

const fetchTrWorkspaces = () => {
  const type = "tr-workspace";
  // If we already fetched these, no need to do it again
  if (fetchedTypes.includes(type)) {
    return;
  }
  
  console.log("Fetching TaskRouter workspaces...");
  
  const wantedWorkspaces = filterWantedVars(type);
  const workspaces = execTwilioCli("twilio api:taskrouter:v1:workspaces:list -o json");
  
  if (!workspaces || workspaces.length < 1) {
    console.error("No TaskRouter workspaces found! Is this a Flex account?");
    return;
  }
  
  for (const workspace of workspaces) {
    for (const wanted in wantedWorkspaces) {
      if (isMatch(wantedWorkspaces[wanted].name, workspace.friendlyName, false)) {
        resultCache[wanted] = workspace.sid;
        break;
      }
    }
  }
  
  fetchedTypes.push(type);
}

const fetchSyncServices = () => {
  const type = "sync-service";
  // If we already fetched these, no need to do it again
  if (fetchedTypes.includes(type)) {
    return;
  }
  
  console.log("Fetching Sync services...");
  
  const wantedServices = filterWantedVars(type);
  const services = execTwilioCli("twilio api:sync:v1:services:list -o json");
  
  if (!services || services.length < 1) {
    console.error("No Sync services found! Is this a Flex account?");
    return;
  }
  
  for (const service of services) {
    for (const wanted in wantedServices) {
      if (isMatch(wantedServices[wanted].name, service.friendlyName, false)) {
        resultCache[wanted] = service.sid;
        break;
      }
    }
  }
  
  fetchedTypes.push(type);
}

const fetchChatServices = () => {
  const type = "chat-service";
  // If we already fetched these, no need to do it again
  if (fetchedTypes.includes(type)) {
    return;
  }
  
  console.log("Fetching chat services...");
  
  const wantedServices = filterWantedVars(type);
  const services = execTwilioCli("twilio api:chat:v2:services:list -o json");
  
  if (!services || services.length < 1) {
    console.error("No chat services found! Is this a Flex account?");
    return;
  }
  
  for (const service of services) {
    for (const wanted in wantedServices) {
      if (isMatch(wantedServices[wanted].name, service.friendlyName, false)) {
        resultCache[wanted] = service.sid;
        break;
      }
    }
  }
  
  fetchedTypes.push(type);
}

// For vars still unknown, fetches needed vars from the API and fills in as appropriate
const fillUnknownEnvVars = (envVars) => {
  for (const key in envVars) {
    if (envVars[key] !== `<YOUR_${key}>` || !constants.varNameMapping[key]) {
      // If this isn't a placeholder value, ignore it.
      // This variable isn't in the constant, so we can't do anything else with it.
      continue;
    }
    
    if (resultCache[key]) {
      // This value was cached previously
      envVars[key] = resultCache[key];
      continue;
    }
    
    // we haven't yet fetched the value; do that based on type
    switch (constants.varNameMapping[key].type) {
      case "serverless-domain":
      fetchServerlessDomains();
      break;
      case "tr-workspace":
      fetchTrWorkspaces();
      break;
      case "tr-workflow":
      // Workflows require the TR workspace SID; fetch them if that has not yet happened
      if (!resultCache.TWILIO_FLEX_WORKSPACE_SID) {
        fetchTrWorkspaces();
      }
      let workspaceSid = resultCache.TWILIO_FLEX_WORKSPACE_SID;
      fetchTrWorkflows(workspaceSid);
      break;
      case "sync-service":
      fetchSyncServices();
      break;
      case "chat-service":
      fetchChatServices();
      break;
      default:
      console.warn(`Unknown placeholder variable type: ${constants.varNameMapping[key].type}`);
      break;
    }
    
    // Get the newly fetched value from cache
    if (resultCache[key]) {
      envVars[key] = resultCache[key];
    }
  }
  
  return envVars;
}

export default async (packageDir, environment) => {
  try {
    // Generate filenames
    const envFile = `./${packageDir}/.env${environment ? `.${environment}` : ''}`;
    const exampleFile = `./${packageDir}/.env.example`;
    
    // Initialize the env vars
    let envVars = await readEnv(envFile, exampleFile);
    
    if (!envVars) {
      console.error(`Unable to create the environment file ${envFile}.`);
      return null;
    }
    
    // Fill known env vars from process.env
    envVars = fillKnownEnvVars(envVars);
    
    // Fetch unknown env vars from the API
    envVars = fillUnknownEnvVars(envVars);
    
    return envVars;
  } catch (error) {
    console.error('Error fetching environment variables', error);
    return null;
  }
}