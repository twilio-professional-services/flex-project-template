import { getFeatureFlags } from '../../utils/configuration';
import SupervisorBargeCoachConfig from './types/ServiceConfiguration';
import { FeatureDefinition } from "../../types/feature-loader";
// @ts-ignore
import hooks from "./flex-hooks/**/*.*";

const { enabled = false, agent_coaching_panel = false, supervisor_monitor_panel = false } = getFeatureFlags()?.features?.supervisor_barge_coach as SupervisorBargeCoachConfig || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const isAgentCoachingPanelEnabled = () => {
  return enabled && agent_coaching_panel;
};

export const isSupervisorMonitorPanelEnabled = () => {
  return enabled && supervisor_monitor_panel;
};

export const register = (): FeatureDefinition => {
  if (!isFeatureEnabled()) return {};
  return { name: "supervisor-barge-coach", hooks: typeof hooks === 'undefined' ? [] : hooks };
};
