import { getFeatureFlags } from '../../utils/configuration';
import { loadFeature } from '../../utils/feature-loader';
import ConferenceConfig from './types/ServiceConfiguration';
// @ts-ignore
import hooks from "./flex-hooks/**/*.*";

const { enabled = false, add_button = false, hold_workaround = false } = getFeatureFlags()?.features?.conference as ConferenceConfig || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const isAddButtonEnabled = () => {
  return enabled && add_button;
};

export const isHoldWorkaroundEnabled = () => {
  return enabled && hold_workaround;
};

export const register = () => {
  if (!isFeatureEnabled()) return;
  loadFeature("conference", hooks);
};