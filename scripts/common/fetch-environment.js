import shell from 'shelljs';

import constants from "./constants.js";

let fetchedTypes = [];
let resultCache = {};

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

export const fetchServerlessDomains = () => {
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
      }
    }
  }
  
  fetchedTypes.push(type);
}

export const fetchTrWorkflows = (workspaceSid) => {
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
      }
    }
  }
  
  fetchedTypes.push(type);
}

export const fetchTrWorkspaces = () => {
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
      }
    }
  }
  
  fetchedTypes.push(type);
}

export const fetchSyncServices = () => {
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
      }
    }
  }
  
  fetchedTypes.push(type);
}

export const fetchChatServices = () => {
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
      }
    }
  }
  
  fetchedTypes.push(type);
}

export const getFetchedVars = () => resultCache;