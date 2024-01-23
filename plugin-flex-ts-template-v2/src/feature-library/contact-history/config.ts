import { getFeatureFlags } from '../../utils/configuration';
import ContactHistoryConfig from './types/ServiceConfiguration';

const { enabled = false, max_contacts = 25 } =
  (getFeatureFlags()?.features?.contact_history as ContactHistoryConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const getMaxContacts = () => {
  return max_contacts;
};
