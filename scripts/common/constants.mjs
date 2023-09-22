import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export const serverlessDir = 'serverless-functions';
export const serverlessSrc = `${serverlessDir}/src`;
export const scheduleManagerServerlessDir = 'serverless-schedule-manager';
export const flexConfigDir = 'flex-config';
export const videoAppDir = 'web-app-examples/twilio-video-demo-app';
export const gitHubWorkflowDir = '.github/workflows';
export const defaultPluginDir = 'plugin-flex-ts-template-v2';

const mappingDefinitionPath = '../config/mappings.json';
export const varNameMapping = JSON.parse(fs.readFileSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)), mappingDefinitionPath)));