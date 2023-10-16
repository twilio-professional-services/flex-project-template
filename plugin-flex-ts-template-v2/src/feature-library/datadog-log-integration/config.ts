import { getFeatureFlags } from '../../utils/configuration';
import DatadogLogIntegrationConfig from './types/ServiceConfiguration';

const {
  enabled = false,
  api_key,
  intake_region,
  flush_timeout,
  log_level,
} = (getFeatureFlags()?.features?.datadog_log_integration as DatadogLogIntegrationConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const getApiKey = () => {
  return api_key;
};

export const getIntakeRegion = () => {
  return intake_region;
};

export const getFlushTimeout = () => {
  return flush_timeout;
};

export const getLogLevel = () => {
  return log_level;
};
