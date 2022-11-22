import * as Flex from "@twilio/flex-ui";

import { UIAttributes } from "types/manager/ServiceConfiguration";
const { custom_data } =
  (Flex.Manager.getInstance().configuration as UIAttributes) || {};
const { enabled = false, agent_coaching_panel = false, supervisor_monitor_panel = false } = custom_data?.features?.supervisor_barge_coach || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const isAgentCoachingPanelEnabled = () => {
  return enabled && agent_coaching_panel;
};

export const isSupervisorMonitorPanelEnabled = () => {
  return enabled && supervisor_monitor_panel;
};
