import { getFeatureFlags } from '../../utils/configuration';

const { enabled = false } = getFeatureFlags()?.features?.chat_transfer || {};

export const isFeatureEnabled = () => {
  return enabled;
};
