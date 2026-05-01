import { getFeatureFlags } from '../../utils/configuration';
import InternalCallConfig from './types/ServiceConfiguration';

const {
  enabled = false,
  enable_call_queue = false,
  enable_call_agent = true,
  application_sid = '',
  outbound_queue_sid = '',
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

export const getApplicationSid = () => {
  return application_sid;
};

export const getOutboundQueueSid = () => {
  return outbound_queue_sid;
};
