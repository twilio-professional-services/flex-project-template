import { getFeatureFlags } from '../../utils/configuration';

const { enabled = false, agent_coaching_panel = false, supervisor_monitor_panel = false } = getFeatureFlags()?.features?.supervisor_barge_coach || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const isAgentCoachingPanelEnabled = () => {
  return enabled && agent_coaching_panel;
};

export const isSupervisorMonitorPanelEnabled = () => {
  return enabled && supervisor_monitor_panel;
};
