import { getFeatureFlags } from '../../utils/configuration';
import ConversationHistoryConfig from './types/ServiceConfiguration';

const { enabled = false } = (getFeatureFlags()?.features?.conversation_history as ConversationHistoryConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};
