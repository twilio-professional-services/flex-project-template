import fs from 'fs';

export const serverlessDir = 'serverless-functions';
export const serverlessSrc = `${serverlessDir}/src`;
export const scheduleManagerServerlessDir = 'serverless-schedule-manager';
export const flexConfigDir = 'flex-config';
export const videoAppDir = 'web-app-examples/video-app-quickstart';
export const gitHubWorkflowDir = '.github/workflows';
export const defaultPluginDir = 'plugin-flex-ts-template-v2';

// Definitions for fetching values from API
export const varNameMapping = JSON.parse(fs.readFileSync('./scripts/config/mappings.json'));