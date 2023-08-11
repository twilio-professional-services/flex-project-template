const serverlessDir = 'serverless-functions';
const scheduleManagerServerlessDir = 'serverless-schedule-manager';
const flexConfigDir = 'flex-config';
const videoAppDir = 'web-app-examples/video-app-quickstart';
const gitHubWorkflowDir = '.github/workflows';
const defaultPluginDir = 'plugin-flex-ts-template-v2';

const varNameMapping = {
  "SERVERLESS_DOMAIN": {
    type: "serverless-domain",
    name: "custom-flex-extensions-serverless",
  },
  "SCHEDULE_MANAGER_DOMAIN": {
    type: "serverless-domain",
    name: "schedule-manager",
  },
  "TWILIO_FLEX_WORKSPACE_SID": {
    type: "tr-workspace",
    name: "Flex Task Assignment",
  },
  "TWILIO_FLEX_SYNC_SID": {
    type: "sync-service",
    name: "Default Service",
  },
  "TWILIO_FLEX_CHAT_SERVICE_SID": {
    type: "chat-service",
    name: /(Flex.*Service)/,
  },
  "TWILIO_FLEX_CHAT_TRANSFER_WORKFLOW_SID": {
    type: "tr-workflow",
    name: "Chat Transfer",
  },
  "TWILIO_FLEX_CALLBACK_WORKFLOW_SID": {
    type: "tr-workflow",
    name: "Callback",
    fallback: /(Assign.*Anyone)/,
  },
  "TWILIO_FLEX_INTERNAL_CALL_WORKFLOW_SID": {
    type: "tr-workflow",
    name: "Internal Call",
  },
};

export default {
  serverlessDir,
  scheduleManagerServerlessDir,
  flexConfigDir,
  videoAppDir,
  gitHubWorkflowDir,
  defaultPluginDir,
  serverlessSrc: `${serverlessDir}/src`,
  varNameMapping,
};