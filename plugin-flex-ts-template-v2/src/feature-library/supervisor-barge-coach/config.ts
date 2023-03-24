import { getFeatureFlags } from '../../utils/configuration';
import SupervisorBargeCoachConfig from './types/ServiceConfiguration';

const {
  enabled = false,
  agent_coaching_panel = false,
  supervisor_monitor_panel = false,
  agent_assistance = false,
  supervisor_alert_toggle = false,
} = (getFeatureFlags()?.features?.supervisor_barge_coach as SupervisorBargeCoachConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const isAgentCoachingPanelEnabled = () => {
  return enabled && agent_coaching_panel;
};

export const isSupervisorMonitorPanelEnabled = () => {
  return enabled && supervisor_monitor_panel;
};

export const isAgentAssistanceEnabled = () => {
  return enabled && agent_assistance;
};

export const isSupervisorAlertToggleEnabled = () => {
  return enabled && supervisor_alert_toggle;
};
