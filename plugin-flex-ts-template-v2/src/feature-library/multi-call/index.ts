import { getFeatureFlags } from '../../utils/configuration';
import MultiCallConfig from './types/ServiceConfiguration';
import { loadFeature } from '../../utils/feature-loader';
// @ts-ignore
import hooks from "./flex-hooks/**/*.*";

const { enabled = false } = getFeatureFlags()?.features?.multi_call as MultiCallConfig || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const register = () => {
  if (!isFeatureEnabled()) return;
  loadFeature("multi-call", hooks);
};