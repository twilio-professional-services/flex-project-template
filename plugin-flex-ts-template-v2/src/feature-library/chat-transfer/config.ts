import { getFeatureFlags } from '../../utils/configuration';
import ChatTransferConfiguration from './types/ServiceConfiguration';

const { enabled = false } = (getFeatureFlags()?.features?.chat_transfer as ChatTransferConfiguration) || {};

export const isFeatureEnabled = () => {
  return enabled;
};
