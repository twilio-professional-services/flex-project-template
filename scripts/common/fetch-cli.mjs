import shell from 'shelljs';

import { varNameMapping } from "./constants.mjs";

let fetchedTypes = [];
let resultCache = {};
let cliCache = {};

// Reusable function for filtering the desired objects to fetch per type
const filterWantedVars = (type, parent) => {
  let wanted = {};
  
  for (const varName in varNameMapping) {
    if (varNameMapping[varName].type !== type || (parent && resultCache[varNameMapping[varName].parent] !== parent)) {
      continue;
    }
    
    wanted[varName] = varNameMapping[varName];
  }
  
  return wanted;
}

// Reusable function for running and parsing Twilio CLI command output
const execTwilioCli = (command) => {
  // first, consult the cache and use it if present
  if (cliCache[command]) {
    return cliCache[command];
  }
  
  const outputRaw = shell.exec(`twilio ${command} --no-limit -o json`, {silent: true});
  
  if (outputRaw.code !== 0) {
    // TODO: Is it possible to identify retry-able error codes?
    throw new Error(`Failed to execute Twilio CLI command. Did you provide valid credentials? Error: ${outputRaw.stderr}`);
  }
  
  if (!outputRaw.stdout) {
    // No results
    return [];
  }
  
  try {
    const outputParsed = JSON.parse(outputRaw.stdout);
    cliCache[command] = outputParsed;
    return outputParsed;
  } catch (error) {
    console.error("Failed to parse Twilio CLI output", error);
    return null;
  }
}

// Reusable function for string compare including regex
const isMatch = (searchValue, valueToCheck, allowFuzz) => {
  if (!searchValue) {
    return false;
  }
  
  if (searchValue.startsWith('/') && searchValue.startsWith('/') && searchValue.length > 2) {
    return new RegExp(searchValue.slice(1, searchValue.length - 1)).test(valueToCheck);
  }
  
  // assume string
  
  if (allowFuzz) {
    return valueToCheck.startsWith(searchValue);
  }
  
  return valueToCheck == searchValue;
}

const fetchResources = (type, displayType, command, handler, parent) => {
  // If we already fetched these, no need to do it again
  const cacheKey = `${type}${parent ? "-" + parent : ""}`;
  if (fetchedTypes.includes(cacheKey)) {
    return;
  }
  fetchedTypes.push(cacheKey);
  
  console.log(`Fetching ${displayType}...`);
  
  let found;
  let wantedResources = filterWantedVars(type, parent);
  const fetchedResources = execTwilioCli(command);
  
  if (!fetchedResources || fetchedResources.length < 1) {
    console.error(`No ${displayType} found. Is this a Flex account?`);
    return;
  }
  
  // if the resource was requested, save it in the cache
  for (const fetched of fetchedResources) {
    for (const wanted in wantedResources) {
      if (handler(fetched, wanted, wantedResources)) {
        found = true;
      }
    }
  }
  
  if (!found) {
    console.error(`No ${displayType} found. Account or configuration in scripts/config/mappings.json may be incorrect.`);
  }
}

export const fetchServerlessDomains = () => {
  fetchResources("serverless-domain", "serverless domains", "api:serverless:v1:services:list", (fetched, wanted, wantedResources) => {
    if (isMatch(wantedResources[wanted].name, fetched.uniqueName, false)) {
      const serviceEnvironments = execTwilioCli(`api:serverless:v1:services:environments:list --service-sid=${fetched.sid}`);
      
      if (!serviceEnvironments || serviceEnvironments.length < 1) {
        return false;
      }
      
      resultCache[wanted] = serviceEnvironments[0].domainName;
      return true;
    }
  });
}

export const fetchServerlessServices = () => {
  fetchResources("serverless-service", "serverless services", "api:serverless:v1:services:list", (fetched, wanted, wantedResources) => {
    if (isMatch(wantedResources[wanted].name, fetched.uniqueName, false)) {
      resultCache[wanted] = fetched.sid;
      return true;
    }
  });
}

export const fetchServerlessEnvironments = (serviceSid) => {
  if (!serviceSid) {
    console.warn("Serverless service SID missing; unable to fetch its environments");
    return;
  }
  fetchResources(`serverless-environment`, `serverless environments for service ${serviceSid}`, `api:serverless:v1:services:environments:list --service-sid=${serviceSid}`, (fetched, wanted, wantedResources) => {
    if (isMatch(wantedResources[wanted].name, fetched.uniqueName, true)) {
      resultCache[wanted] = fetched.sid;
      return true;
    }
  }, serviceSid);
}

export const fetchServerlessFunctions = (serviceSid) => {
  if (!serviceSid) {
    console.warn("Serverless service SID missing; unable to fetch its functions");
    return;
  }
  fetchResources(`serverless-function`, `serverless functions for service ${serviceSid}`, `api:serverless:v1:services:functions:list --service-sid=${serviceSid}`, (fetched, wanted, wantedResources) => {
    if (isMatch(wantedResources[wanted].name, fetched.friendlyName, true)) {
      resultCache[wanted] = fetched.sid;
      return true;
    }
  }, serviceSid);
}

export const fetchTrWorkflows = (workspaceSid) => {
  if (!workspaceSid) {
    console.warn("TaskRouter workspace SID missing; unable to fetch workflows");
    return;
  }
  fetchResources(`tr-workflow`, `TaskRouter workflows`, `api:taskrouter:v1:workspaces:workflows:list --workspace-sid=${workspaceSid}`, (fetched, wanted, wantedResources) => {
    // only match the fallback if the specified name is not already found
    if (isMatch(wantedResources[wanted].name, fetched.friendlyName, true) || (!resultCache[wanted] && isMatch(wantedResources[wanted].fallback, fetched.friendlyName, true))) {
      resultCache[wanted] = fetched.sid;
      return true;
    }
  }, workspaceSid);
}

export const fetchTrWorkspaces = () => {
  fetchResources("tr-workspace", "TaskRouter workspaces", "api:taskrouter:v1:workspaces:list", (fetched, wanted, wantedResources) => {
    if (isMatch(wantedResources[wanted].name, fetched.friendlyName, false)) {
      resultCache[wanted] = fetched.sid;
      return true;
    }
  });
}

export const fetchSyncServices = () => {
  fetchResources("sync-service", "Sync services", "api:sync:v1:services:list", (fetched, wanted, wantedResources) => {
    if (isMatch(wantedResources[wanted].name, fetched.friendlyName, false)) {
      resultCache[wanted] = fetched.sid;
      return true;
    }
  });
}

export const fetchChatServices = () => {
  fetchResources("chat-service", "chat services", "api:chat:v2:services:list", (fetched, wanted, wantedResources) => {
    if (isMatch(wantedResources[wanted].name, fetched.friendlyName, false)) {
      resultCache[wanted] = fetched.sid;
      return true;
    }
  });
}

export const getFetchedVars = () => resultCache;