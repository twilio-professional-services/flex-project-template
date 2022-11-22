import * as Flex from "@twilio/flex-ui";

import { UIAttributes } from "types/manager/ServiceConfiguration";
const { custom_data } =
  (Flex.Manager.getInstance().configuration as UIAttributes) || {};
const { enabled = false, allow_requeue = false, max_attempts = 1, auto_select_task = false } = custom_data?.features?.callbacks || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const isAllowRequeueEnabled = () => {
  return enabled && allow_requeue;
};

export const isAutoSelectTaskEnabled = () => {
  return enabled && auto_select_task;
};

export const getMaxAttempts = () => {
  return max_attempts;
}
