import * as Flex from "@twilio/flex-ui";

import { UIAttributes } from "types/manager/ServiceConfiguration";
const { custom_data } =
  (Flex.Manager.getInstance().serviceConfiguration
    .ui_attributes as UIAttributes) || {};
const { enabled = false } = custom_data?.features?.chat_transfer || {};

export const isFeatureEnabled = () => {
  return enabled;
};
