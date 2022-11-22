import * as Flex from "@twilio/flex-ui";

import { UIAttributes } from "types/manager/ServiceConfiguration";
const { custom_data } =
  (Flex.Manager.getInstance().configuration as UIAttributes) || {};
const { enabled = false, serverless_domain } = custom_data?.features?.schedule_manager || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const getServerlessDomain = () => {
  return serverless_domain;
};
