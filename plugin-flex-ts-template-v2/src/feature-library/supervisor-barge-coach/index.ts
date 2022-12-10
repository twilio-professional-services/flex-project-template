import { getFeatureFlags } from '../../utils/configuration';

const { enabled = false, agent_coaching_panel = false, supervisor_monitor_panel = false } = getFeatureFlags()?.features?.supervisor_barge_coach || {};
const { enabled:supervisor_complete_reservation_enabled = false } = getFeatureFlags()?.features?.supervisor_complete_reservation || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const isAgentCoachingPanelEnabled = () => {
  return enabled && agent_coaching_panel;
};

export const isSupervisorMonitorPanelEnabled = () => {
  return enabled && supervisor_monitor_panel;
};

export const isSupervisorCompleteReservationEnabled = () => {
  return supervisor_complete_reservation_enabled;
}
