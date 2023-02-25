import { getFeatureFlags } from '../../utils/configuration';
import { loadFeature } from '../../utils/feature-loader';
// @ts-ignore
import hooks from "./flex-hooks/**/*.*";
import ChatToVideoEscalationConfig from './types/ServiceConfiguration';

const { enabled = false } = getFeatureFlags()?.features?.chat_to_video_escalation as ChatToVideoEscalationConfig || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const register = () => {
  if (!isFeatureEnabled()) return;
  loadFeature("chat-to-video-escalation", hooks);
};
