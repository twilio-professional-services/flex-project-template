import { getFeatureFlags } from '../../utils/configuration';
import { loadFeature } from '../../utils/feature-loader';
// @ts-ignore
import hooks from "./flex-hooks/**/*.*";
import ConversationTransferConfiguration from './types/ServiceConfiguration';

const {
  enabled = false,
  cold_transfer = false,
  multi_participant = false,
} = getFeatureFlags()?.features?.conversation_transfer as ConversationTransferConfiguration || {};

export const isColdTransferEnabled = () => {
  return enabled && cold_transfer;
};

export const isMultiParticipantEnabled = () => {
  return enabled && multi_participant;
};

export const register = () => {
  if (!enabled) return;
  loadFeature("conversation-transfer", hooks);
};
