export const serverlessDir = 'serverless-functions';
export const serverlessSrc = `${serverlessDir}/src`;
export const scheduleManagerServerlessDir = 'serverless-schedule-manager';
export const flexConfigDir = 'flex-config';
export const videoAppDir = 'web-app-examples/video-app-quickstart';
export const gitHubWorkflowDir = '.github/workflows';
export const defaultPluginDir = 'plugin-flex-ts-template-v2';

// Definitions for fetching values from API
export const varNameMapping = {
  "SERVERLESS_DOMAIN": {
    type: "serverless-domain",
    name: "custom-flex-extensions-serverless",
  },
  "SCHEDULE_MANAGER_DOMAIN": {
    type: "serverless-domain",
    name: "schedule-manager",
  },
  "VIDEO_SERVERLESS_DOMAIN": {
    type: "serverless-domain",
    name: "custom-flex-extensions-serverless",
    localValue: "localhost:3001",
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