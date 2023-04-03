import { getFeatureFlags } from '../../utils/configuration';

const { enabled = false, url = '' } = getFeatureFlags()?.features?.custom_hold_music || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const getHoldMusicUrl = () => {
  return url;
};
