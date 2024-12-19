import { Manager } from '@twilio/flex-ui';

import { getFeatureFlags } from '../../utils/configuration';
import ConversationTransferConfiguration from './types/ServiceConfiguration';

const {
  enabled = false,
  cold_transfer = false,
  multi_participant = false,
} = (getFeatureFlags()?.features?.conversation_transfer as ConversationTransferConfiguration) || {};

const isNativeDigitalXferEnabled = (): boolean => {
  return Manager.getInstance().store.getState().flex.featureFlags?.transfersConfig?.enabled === true;
};

export const isFeatureEnabled = () => {
  return enabled && !isNativeDigitalXferEnabled();
};

export const isColdTransferEnabled = () => {
  return enabled && cold_transfer;
};

export const isMultiParticipantEnabled = () => {
  return enabled && multi_participant;
};
