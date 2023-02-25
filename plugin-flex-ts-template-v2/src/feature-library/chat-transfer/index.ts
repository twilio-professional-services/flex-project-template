import { getFeatureFlags } from '../../utils/configuration';
import ChatTransferConfiguration from './types/ServiceConfiguration';
import { loadFeature } from '../../utils/feature-loader';
// @ts-ignore
import hooks from "./flex-hooks/**/*.*";

const { enabled = false } = getFeatureFlags()?.features?.chat_transfer as ChatTransferConfiguration || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const register = () => {
  if (!isFeatureEnabled()) return;
  loadFeature("chat-transfer", hooks);
};
