import { getFeatureFlags } from '../../utils/configuration';
import ConversationTransferConfiguration from './types/ServiceConfiguration';

const {
  enabled = false,
  cold_transfer = false,
  multi_participant = false,
} = (getFeatureFlags()?.features?.conversation_transfer as ConversationTransferConfiguration) || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const isColdTransferEnabled = () => {
  return enabled && cold_transfer;
};

export const isMultiParticipantEnabled = () => {
  return enabled && multi_participant;
};
