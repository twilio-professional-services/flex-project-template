import { getFeatureFlags } from '../../utils/configuration';
import ChatToVideoEscalationConfig from './types/ServiceConfiguration';

const { enabled = false } =
  (getFeatureFlags()?.features?.chat_to_video_escalation as ChatToVideoEscalationConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};
