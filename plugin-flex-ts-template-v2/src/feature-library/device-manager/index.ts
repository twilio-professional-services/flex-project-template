import { getFeatureFlags } from '../../utils/configuration';
import { loadFeature } from '../../utils/feature-loader';
// @ts-ignore
import hooks from "./flex-hooks/**/*.*";
import DeviceManagerConfig from './types/ServiceConfiguration';

const { enabled = false } = getFeatureFlags()?.features?.device_manager as DeviceManagerConfig || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const register = () => {
  if (!isFeatureEnabled()) return;
  loadFeature("device-manager", hooks);
};
