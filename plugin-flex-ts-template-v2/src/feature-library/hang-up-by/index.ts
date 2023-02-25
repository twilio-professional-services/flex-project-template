import { getFeatureFlags } from '../../utils/configuration';
import { loadFeature } from '../../utils/feature-loader';
// @ts-ignore
import hooks from "./flex-hooks/**/*.*";
import HangUpByConfig from './types/ServiceConfiguration';

const { enabled = false } = getFeatureFlags()?.features?.hang_up_by as HangUpByConfig || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const register = () => {
  if (!isFeatureEnabled()) return;
  loadFeature("hang-up-by", hooks);
};
