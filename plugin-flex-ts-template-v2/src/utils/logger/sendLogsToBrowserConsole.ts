import { getFeatureFlags } from '../configuration';
import Console from './Console';

const { log_level = 'debug' } = getFeatureFlags().common || {};

export const loggerHook = function sendLogsToBrowserConsole() {
  return new Console({ minLogLevel: log_level, metaData: null });
};
