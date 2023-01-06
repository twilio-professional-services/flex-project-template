import * as Flex from "@twilio/flex-ui";

import { UIAttributes } from "types/manager/ServiceConfiguration";
const { custom_data } =
  (Flex.Manager.getInstance().serviceConfiguration
    .ui_attributes as UIAttributes) || {};
const {
  enabled = false,
  cold_transfer = false,
  multi_participant = false,
} = custom_data?.features?.conversation_transfer || {};

export const isColdTransferEnabled = () => {
  return enabled && cold_transfer;
};

export const isMultiParticipantEnabled = () => {
  return enabled && multi_participant;
};
