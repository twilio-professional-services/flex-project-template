import { getFeatureFlags } from '../../utils/configuration';
import ContactsConfig from './types/ServiceConfiguration';

const { enabled = false, recent_days = 14 } = (getFeatureFlags()?.features?.contacts as ContactsConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const getRecentDays = () => {
  return recent_days;
};
