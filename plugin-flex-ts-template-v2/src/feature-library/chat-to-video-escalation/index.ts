import { getFeatureFlags } from '../../utils/configuration';

const { enabled = false } = getFeatureFlags()?.features?.chat_to_video_escalation || {};

export const isFeatureEnabled = () => {
  return enabled;
};
