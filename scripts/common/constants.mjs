import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

export const serverlessDir = 'serverless-functions';
export const serverlessSrc = `${serverlessDir}/src`;
export const scheduleManagerServerlessDir = 'serverless-schedule-manager';
export const flexConfigDir = 'flex-config';
export const videoAppDir = 'web-app-examples/twilio-video-demo-app';
export const gitHubWorkflowDir = '.github/workflows';
export const defaultPluginDir = 'plugin-flex-ts-template-v2';
export const cliConfigPath = path.resolve(os.homedir(), '.twilio-cli/config.json');
export const infraAsCodeDir = 'infra-as-code';
export const terraformDir = `${infraAsCodeDir}/terraform`

const mappingDefinitionPath = '../config/mappings.json';
export const varNameMapping = JSON.parse(fs.readFileSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)), mappingDefinitionPath)));