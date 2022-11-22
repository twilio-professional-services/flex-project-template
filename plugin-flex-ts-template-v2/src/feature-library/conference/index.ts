import * as Flex from "@twilio/flex-ui";

import { UIAttributes } from "types/manager/ServiceConfiguration";
const { custom_data } =
  (Flex.Manager.getInstance().configuration as UIAttributes) || {};
const { enabled = false, add_button = false, hold_workaround = false } = custom_data?.features?.conference || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const isAddButtonEnabled = () => {
  return enabled && add_button;
};

export const isHoldWorkaroundEnabled = () => {
  return enabled && hold_workaround;
};