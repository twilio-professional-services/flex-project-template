import * as Flex from "@twilio/flex-ui";

import { UIAttributes } from "types/manager/ServiceConfiguration";
const { custom_data } =
  (Flex.Manager.getInstance().configuration as UIAttributes) || {};
const { enabled = false, rules } = custom_data?.features?.supervisor_capacity || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const getRules = () => {
  return rules;
};
