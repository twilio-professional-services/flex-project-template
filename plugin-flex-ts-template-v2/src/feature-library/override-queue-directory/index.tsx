import * as Flex from '@twilio/flex-ui';

import { UIAttributes } from 'types/manager/ServiceConfiguration';

export const { custom_data } =
  (Flex.Manager.getInstance().serviceConfiguration
    .ui_attributes as UIAttributes) || {};

const {
  enabled = false,
  cold_transfer = false,
  multi_participant = false,
} = custom_data?.features?.chat_transfer || {};

const { override_enabled = false } =
  custom_data?.features?.override_queue_transfer_directory || {};

export const isOverrideQueueTransferEnabled = () => {
  return override_enabled;
};
export const isChatTransferEnabled = () => {
  return enabled;
};

export const isColdTransferEnabled = () => {
  return enabled && cold_transfer;
};

export const isMultiParticipantEnabled = () => {
  return enabled && multi_participant;
};
