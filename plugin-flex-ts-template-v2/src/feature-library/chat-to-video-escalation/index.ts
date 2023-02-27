import { getFeatureFlags } from '../../utils/configuration';
import { FeatureDefinition } from "../../types/feature-loader";
// @ts-ignore
import hooks from "./flex-hooks/**/*.*";
import ChatToVideoEscalationConfig from './types/ServiceConfiguration';

const { enabled = false } = getFeatureFlags()?.features?.chat_to_video_escalation as ChatToVideoEscalationConfig || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const register = (): FeatureDefinition => {
  if (!isFeatureEnabled()) return {};
  return { name: "chat-to-video-escalation", hooks: typeof hooks === 'undefined' ? [] : hooks };
};
