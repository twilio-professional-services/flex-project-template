import twilio from 'twilio';

import { varNameMapping } from "./constants.mjs";

let fetchedTypes = [];
let resultCache = {};
let apiCache = {};
let twilioClient = null;

// Initialize Twilio client with provided account credentials
export const setAccount = (account) => {
  if (!account.accountSid) {
    throw new Error('TWILIO_ACCOUNT_SID environment variable is required');
  }

  // Prefer API key/secret over auth token
  if (account.apiKey && account.apiSecret) {
    twilioClient = twilio(account.apiKey, account.apiSecret, { accountSid: account.accountSid });
  } else if (authToken) {
    twilioClient = twilio(account.accountSid, account.authToken);
  } else {
    throw new Error('Either TWILIO_API_KEY/TWILIO_API_SECRET or TWILIO_AUTH_TOKEN must be provided');
  }
}

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

// Reusable function for executing Twilio API calls
const execTwilioApi = async (apiCall, cacheKey) => {
  // first, consult the cache and use it if present
  if (apiCache[cacheKey]) {
    return apiCache[cacheKey];
  }

  if (!twilioClient) {
    throw new Error(`The Twilio client has not been initialized with account details.`);
  }

  try {
    const result = await apiCall(twilioClient);
    apiCache[cacheKey] = result;
    return result;
  } catch (error) {
    throw new Error(`Failed to execute Twilio API call. Did you provide valid credentials? Error: ${error.message}`);
  }
}

// Reusable function for string compare including regex
export const isMatch = (searchValue, valueToCheck, allowFuzz) => {
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

const fetchResources = async (type, displayType, apiCall, handler, parent) => {
  // If we already fetched these, no need to do it again
  const cacheKey = `${type}${parent ? "-" + parent : ""}`;
  if (fetchedTypes.includes(cacheKey)) {
    return;
  }
  fetchedTypes.push(cacheKey);

  console.log(`Fetching ${displayType}...`);

  let found;
  let wantedResources = filterWantedVars(type, parent);
  const fetchedResources = await execTwilioApi(apiCall, cacheKey);

  if (!fetchedResources || fetchedResources.length < 1) {
    console.error(`No ${displayType} found. Is this a Flex account?`);
    return;
  }

  // if the resource was requested, save it in the cache
  for (const fetched of fetchedResources) {
    for (const wanted in wantedResources) {
      const handlerResult = await handler(fetched, wanted, wantedResources);
      if (handlerResult) {
        found = true;
      }
    }
  }

  if (!found) {
    console.error(`No ${displayType} found. Account or configuration in scripts/config/mappings.json may be incorrect.`);
  }
}

export const fetchServerlessDomains = async () => {
  await fetchResources(
    "serverless-domain",
    "serverless domains",
    async (client) => (await client.serverless.v1.services.list()),
    async (fetched, wanted, wantedResources) => {
      if (isMatch(wantedResources[wanted].name, fetched.uniqueName, false)) {
        const serviceEnvironments = await execTwilioApi(
          (client) => client.serverless.v1.services(fetched.sid).environments.list(),
          `serverless-service-environments-${fetched.sid}`
        );

        if (!serviceEnvironments || serviceEnvironments.length < 1) {
          return false;
        }

        resultCache[wanted] = serviceEnvironments[0].domainName;
        return true;
      }
    }
  );
}

export const fetchServerlessServices = async () => {
  await fetchResources(
    "serverless-service",
    "serverless services",
    async (client) => (await client.serverless.v1.services.list()),
    async (fetched, wanted, wantedResources) => {
      if (isMatch(wantedResources[wanted].name, fetched.uniqueName, false)) {
        resultCache[wanted] = fetched.sid;
        return true;
      }
    }
  );
}

export const fetchServerlessEnvironments = async (serviceSid) => {
  if (!serviceSid) {
    console.warn("Serverless service SID missing; unable to fetch its environments");
    return;
  }
  await fetchResources(
    `serverless-environment`,
    `serverless environments for service ${serviceSid}`,
    async (client) => (await client.serverless.v1.services(serviceSid).environments.list()),
    async (fetched, wanted, wantedResources) => {
      if (isMatch(wantedResources[wanted].name, fetched.uniqueName, true)) {
        resultCache[wanted] = fetched.sid;
        return true;
      }
    },
    serviceSid
  );
}

export const fetchServerlessFunctions = async (serviceSid) => {
  if (!serviceSid) {
    console.warn("Serverless service SID missing; unable to fetch its functions");
    return;
  }
  await fetchResources(
    `serverless-function`,
    `serverless functions for service ${serviceSid}`,
    async (client) => (await client.serverless.v1.services(serviceSid).functions.list()),
    async (fetched, wanted, wantedResources) => {
      if (isMatch(wantedResources[wanted].name, fetched.friendlyName, true)) {
        resultCache[wanted] = fetched.sid;
        return true;
      }
    },
    serviceSid
  );
}

export const fetchStudioFlows = async () => {
  await fetchResources(
    "studio-flow",
    "Studio flows",
    async (client) => (await client.studio.v2.flows.list()),
    async (fetched, wanted, wantedResources) => {
      if (isMatch(wantedResources[wanted].name, fetched.friendlyName, false)) {
        resultCache[wanted] = fetched.sid;
        return true;
      }
    }
  );
}

export const fetchTrQueues = async (workspaceSid) => {
  if (!workspaceSid) {
    console.warn("TaskRouter workspace SID missing; unable to fetch task queues");
    return;
  }
  await fetchResources(
    `tr-queue`,
    `TaskRouter task queues`,
    async (client) => (await client.taskrouter.v1.workspaces(workspaceSid).taskQueues.list()),
    async (fetched, wanted, wantedResources) => {
      // only match the fallback if the specified name is not already found
      if (isMatch(wantedResources[wanted].name, fetched.friendlyName, true) || (!resultCache[wanted] && isMatch(wantedResources[wanted].fallback, fetched.friendlyName, true))) {
        resultCache[wanted] = fetched.sid;
        return true;
      }
    },
    workspaceSid
  );
}

export const fetchTrWorkflows = async (workspaceSid) => {
  if (!workspaceSid) {
    console.warn("TaskRouter workspace SID missing; unable to fetch workflows");
    return;
  }
  await fetchResources(
    `tr-workflow`,
    `TaskRouter workflows`,
    async (client) => (await client.taskrouter.v1.workspaces(workspaceSid).workflows.list()),
    async (fetched, wanted, wantedResources) => {
      // only match the fallback if the specified name is not already found
      if (isMatch(wantedResources[wanted].name, fetched.friendlyName, true) || (!resultCache[wanted] && isMatch(wantedResources[wanted].fallback, fetched.friendlyName, true))) {
        resultCache[wanted] = fetched.sid;
        return true;
      }
    },
    workspaceSid
  );
}

export const fetchTrWorkspaces = async () => {
  await fetchResources(
    "tr-workspace",
    "TaskRouter workspaces",
    async (client) => (await client.taskrouter.v1.workspaces.list()),
    async (fetched, wanted, wantedResources) => {
      if (isMatch(wantedResources[wanted].name, fetched.friendlyName, false)) {
        resultCache[wanted] = fetched.sid;
        return true;
      }
    }
  );
}

export const fetchSyncServices = async () => {
  await fetchResources(
    "sync-service",
    "Sync services",
    async (client) => (await client.sync.v1.services.list()),
    async (fetched, wanted, wantedResources) => {
      if (isMatch(wantedResources[wanted].name, fetched.friendlyName, false)) {
        resultCache[wanted] = fetched.sid;
        return true;
      }
    }
  );
}

export const fetchChatServices = async () => {
  await fetchResources(
    "chat-service",
    "chat services",
    async (client) => (await client.chat.v2.services.list()),
    async (fetched, wanted, wantedResources) => {
      if (isMatch(wantedResources[wanted].name, fetched.friendlyName, false)) {
        resultCache[wanted] = fetched.sid;
        return true;
      }
    }
  );
}

export const getFetchedVars = () => resultCache;