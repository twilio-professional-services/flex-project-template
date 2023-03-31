import { getFeatureFlags } from '../../utils/configuration';
import ConferenceConfig from './types/ServiceConfiguration';

const {
  enabled = false,
  add_button = false,
  hold_workaround = false,
} = (getFeatureFlags()?.features?.conference as ConferenceConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const isAddButtonEnabled = () => {
  return enabled && add_button;
};

export const isHoldWorkaroundEnabled = () => {
  return enabled && hold_workaround;
};
