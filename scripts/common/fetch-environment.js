import 'dotenv';
import { promises as fs } from 'fs';
import shell from 'shelljs';

import constants from "./constants.js";

let serverlessDomains = null;
let syncServices = null;
let chatServices = null;
let trWorkspaces = null;
let trWorkflows = null;

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
  let wanted = [];
  
  for (const varName of constants.varNameMapping) {
    if (constants.varNameMapping[varName].type !== type) {
      continue;
    }
    
    wanted.push(constants.varNameMapping[varName]);
  }
  
  return wanted;
}

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
  // If we already fetched these, return the result
  if (serverlessDomains) {
    return serverlessDomains;
  }
  
  // First, get the list of domains we need to fetch from the constant
  let wantedDomains = filterWantedVars("serverless-domain");
  
  // Then, fetch serverless services
  const serverlessServices = execTwilioCli("twilio api:serverless:v1:services:list -o json");
  
  if (!serverlessServices) {
    return [];
  }
  
  // for each of the services we found, if it is one we are interested in, get its environments and add to the array
  let serverlessDomainsFound = [];
  
  for (const service of serverlessServices) {
    let isWanted = false;
    for (const wanted of wantedDomains) {
      if (isMatch(wanted.name, service.uniqueName, false)) {
        isWanted = true;
        break;
      }
    }
    if (!isWanted) {
      continue;
    }
    
    const serviceEnvironments = execTwilioCli(`twilio api:serverless:v1:services:environments:list --service-sid=${service.sid} -o json`);
    
    if (!serviceEnvironments || serviceEnvironments.length < 1) {
      continue;
    }
    
    serverlessDomainsFound.push({
      serviceName: service.uniqueName,
      serviceSid: serviceEnvironments[0].serviceSid,
      domainName: serviceEnvironments[0].domainName,
    });
  }
  
  // save in a global var so that we don't need to re-fetch later
  serverlessDomains = serverlessDomainsFound;
  return serverlessDomains;
}

const fetchTrWorkflows = (workspaceSid) => {
  // If we already fetched these, return the result
  if (trWorkflows) {
    return trWorkflows;
  }
  
  const wantedWorkflows = filterWantedVars("tr-workflow");
  const workflows = execTwilioCli(`twilio api:taskrouter:v1:workspaces:workflows:list --workspace-sid=${workspaceSid} -o json`);
  
  if (!workflows || workflows.length < 1) {
    return [];
  }
  
  let workflowsFound = [];
  
  for (const workflow of workflows) {
    let isWanted = false;
    for (const wanted of wantedWorkflows) {
      if (isMatch(wanted.name, workflow.friendlyName, true) || isMatch(wanted.fallback, workflow.friendlyName, true)) {
        isWanted = true;
        break;
      }
    }
    
    if (isWanted) {
      workflowsFound.push(workflow);
    }
  }
  
  trWorkflows = workflowsFound;
  return trWorkflows;
}

const fetchTrWorkspaces = () => {
  // If we already fetched these, return the result
  if (trWorkspaces) {
    return trWorkspaces;
  }
  
  const wantedWorkspaces = filterWantedVars("tr-workspace");
  const workspaces = execTwilioCli("twilio api:taskrouter:v1:workspaces:list -o json");
  
  if (!workspaces || workspaces.length < 1) {
    console.error("No TaskRouter workspaces found! Is this a Flex account?");
    return [];
  }
  
  let workspacesFound = [];
  
  for (const workspace of workspaces) {
    let isWanted = false;
    for (const wanted of wantedWorkspaces) {
      if (isMatch(wanted.name, workspace.friendlyName, false)) {
        isWanted = true;
        break;
      }
    }
    if (!isWanted) {
      continue;
    }
    
    workspacesFound.push(workspace);
  }
  
  trWorkspaces = workspacesFound;
  return trWorkspaces;
}

const fetchSyncServices = () => {
  // If we already fetched these, return the result
  if (syncServices) {
    return syncServices;
  }
  
  const wantedServices = filterWantedVars("sync-service");
  const services = execTwilioCli("twilio api:sync:v1:services:list -o json");
  
  if (!services || services.length < 1) {
    console.error("No Sync services found! Is this a Flex account?");
    return [];
  }
  
  let servicesFound = [];
  
  for (const service of services) {
    let isWanted = false;
    for (const wanted of wantedServices) {
      if (isMatch(wanted.name, service.friendlyName, false)) {
        isWanted = true;
        break;
      }
    }
    if (!isWanted) {
      continue;
    }
    
    servicesFound.push(service);
  }
  
  syncServices = servicesFound;
  return syncServices;
}

const fetchChatServices = () => {
  // If we already fetched these, return the result
  if (chatServices) {
    return chatServices;
  }
  
  const wantedServices = filterWantedVars("chat-service").map(wanted => wanted.name);
  const services = execTwilioCli("twilio api:chat:v2:services:list -o json");
  
  if (!services || services.length < 1) {
    console.error("No chat services found! Is this a Flex account?");
    return [];
  }
  
  let servicesFound = [];
  
  for (const service of services) {
    let isWanted = false;
    for (const wanted of wantedServices) {
      if (isMatch(wanted.name, service.friendlyName, false)) {
        isWanted = true;
        break;
      }
    }
    if (!isWanted) {
      continue;
    }
    
    servicesFound.push(service);
  }
  
  chatServices = servicesFound;
  return chatServices;
}

const fillUnknownEnvVars = (envVars) => {
  // TODO
  // 1. for each placeholder var
  // 2. check the map for a definition
  // 3. check the fetched data for a value
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