import { getFeatureFlags } from '../../utils/configuration';
import AdressBookConfig from './types/ServiceConfiguration';

const { enabled = false } = (getFeatureFlags()?.features?.adress_book as AdressBookConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const PAGE_SIZE = 10;
