import { getFeatureFlags } from '../../utils/configuration';
import AutomaticEndChatMessageConfig from './types/ServiceConfiguration';

const { enabled = false, message = '' } =
  (getFeatureFlags()?.features?.automatic_end_chat_message as AutomaticEndChatMessageConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const getEndChatMessage = () => {
  return message;
};
