import { getFeatureFlags } from '../../utils/configuration';
import ContactsConfig from './types/ServiceConfiguration';

const {
  enabled = false,
  enable_recents = false,
  enable_personal = false,
  enable_shared = false,
  recent_days_to_keep = 14,
  shared_agent_editable = false,
  page_size = 10,
} = (getFeatureFlags()?.features?.contacts as ContactsConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const getRecentDaysToKeep = () => {
  return recent_days_to_keep;
};

export const isRecentsEnabled = () => {
  return enable_recents;
};

export const isPersonalDirectoryEnabled = () => {
  return enable_personal;
};

export const isSharedDirectoryEnabled = () => {
  return enable_shared;
};

export const isSharedDirectoryAgentEditable = () => {
  return shared_agent_editable;
};

export const getPageSize = () => {
  return page_size;
};
