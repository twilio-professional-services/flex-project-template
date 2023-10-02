import { getFeatureFlags } from '../../utils/configuration';
import ConsoleLogIntegrationConfig from './types/ServiceConfiguration';

const { enabled = true, log_level = 'info' } =
  (getFeatureFlags()?.features?.console_log_integration as ConsoleLogIntegrationConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const getLogLevel = () => {
  return log_level;
};
