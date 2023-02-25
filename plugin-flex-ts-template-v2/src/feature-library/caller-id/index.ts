import { getFeatureFlags } from '../../utils/configuration';
import { loadFeature } from '../../utils/feature-loader';
// @ts-ignore
import hooks from "./flex-hooks/**/*.*";
import CallerIdConfig from './types/ServiceConfiguration';

const { enabled = false } = getFeatureFlags()?.features?.caller_id as CallerIdConfig || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const register = () => {
  if (!isFeatureEnabled()) return;
  loadFeature("caller-id", hooks);
};
