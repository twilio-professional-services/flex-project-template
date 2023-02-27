import { getFeatureFlags } from '../../utils/configuration';
import { FeatureDefinition } from "../../types/feature-loader";
// @ts-ignore
import hooks from "./flex-hooks/**/*.*";
import DeviceManagerConfig from './types/ServiceConfiguration';

const { enabled = false } = getFeatureFlags()?.features?.device_manager as DeviceManagerConfig || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const register = (): FeatureDefinition => {
  if (!isFeatureEnabled()) return {};
  return { name: "device-manager", hooks: typeof hooks === 'undefined' ? [] : hooks };
};
