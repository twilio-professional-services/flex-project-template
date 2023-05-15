import { getFeatureFlags } from '../../utils/configuration';
import DeviceManagerConfig from './types/ServiceConfiguration';

const { enabled = false } = (getFeatureFlags()?.features?.device_manager as DeviceManagerConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};
