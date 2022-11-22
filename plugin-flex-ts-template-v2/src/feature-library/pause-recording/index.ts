import * as Flex from "@twilio/flex-ui";

import { UIAttributes } from "types/manager/ServiceConfiguration";
const { custom_data } =
  (Flex.Manager.getInstance().configuration as UIAttributes) || {};
const { enabled = false, indicator_permanent = false, indicator_banner = false, include_silence = false } = custom_data?.features?.pause_recording || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const isBannerIndicatorEnabled = () => {
  return enabled && indicator_banner;
};

export const isPermanentIndicatorEnabled = () => {
  return enabled && indicator_permanent;
};

export const isIncludeSilenceEnabled = () => {
  return enabled && include_silence;
};
