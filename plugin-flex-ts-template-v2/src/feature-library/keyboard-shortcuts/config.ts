import { getFeatureFlags } from '../../utils/configuration';

const { enabled = false } = getFeatureFlags()?.features?.keyboard_shortcuts || {};

export const isFeatureEnabled = () => {
  return enabled;
};
