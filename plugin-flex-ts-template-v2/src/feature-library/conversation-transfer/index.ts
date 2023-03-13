import { getFeatureFlags } from '../../utils/configuration';
import { FeatureDefinition } from "../../types/feature-loader";
// @ts-ignore
import hooks from "./flex-hooks/**/*.*";
import ConversationTransferConfiguration from './types/ServiceConfiguration';

const {
  enabled = false,
  cold_transfer = false,
  multi_participant = false,
} = getFeatureFlags()?.features?.conversation_transfer as ConversationTransferConfiguration || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const isColdTransferEnabled = () => {
  return enabled && cold_transfer;
};

export const isMultiParticipantEnabled = () => {
  return enabled && multi_participant;
};

export const register = (): FeatureDefinition => {
  if (!isFeatureEnabled()) return {};
  return { name: "conversation-transfer", hooks: typeof hooks === 'undefined' ? [] : hooks };
};
