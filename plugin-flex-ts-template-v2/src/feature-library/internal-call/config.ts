import { getFeatureFlags } from '../../utils/configuration';
import InternalCallConfig from './types/ServiceConfiguration';

const {
  enabled = false,
  enable_call_queue = false,
  enable_call_agent = true,
} = (getFeatureFlags()?.features?.internal_call as InternalCallConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const isCallAgentEnabled = () => {
  return enable_call_agent;
};

export const isCallQueueEnabled = () => {
  return enable_call_queue;
};
