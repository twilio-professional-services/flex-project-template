import { getFeatureFlags } from '../../utils/configuration';
import ContactsConfig from './types/ServiceConfiguration';

const { enabled = false, max_contacts = 25 } = (getFeatureFlags()?.features?.contacts as ContactsConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const getMaxContacts = () => {
  return max_contacts;
};
