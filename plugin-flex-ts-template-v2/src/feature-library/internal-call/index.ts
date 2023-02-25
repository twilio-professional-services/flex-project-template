import { getFeatureFlags } from '../../utils/configuration';
import InternalCallConfig from './types/ServiceConfiguration';
import { loadFeature } from '../../utils/feature-loader';
// @ts-ignore
import hooks from "./flex-hooks/**/*.*";

const { enabled = false } = getFeatureFlags()?.features?.internal_call as InternalCallConfig || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const register = () => {
  if (!isFeatureEnabled()) return;
  loadFeature("internal-call", hooks);
};
