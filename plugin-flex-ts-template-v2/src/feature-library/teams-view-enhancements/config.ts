import { getFeatureFlags } from '../../utils/configuration';
import TeamsViewEnhancementsConfig from './types/ServiceConfiguration';

const {
  enabled = false,
  highlight_handle_time = true,
  handle_time_warning_threshold = 180,
  handle_time_exceeded_threshold = 300,
  display_task_queue_name = true,
} = (getFeatureFlags()?.features?.teams_view_enhancements as TeamsViewEnhancementsConfig) || {};

const {
  team = false,
  department = false,
  location = false,
  agent_skills = true,
} = getFeatureFlags().features?.teams_view_enhancements?.columns || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const isTeamColumnEnabled = () => {
  return enabled && team;
};

export const isDepartmentColumnEnabled = () => {
  return enabled && department;
};

export const isLocationColumnEnabled = () => {
  return enabled && location;
};

export const isAgentSkillsColumnEnabled = () => {
  return enabled && agent_skills;
};

export const isHTHighlightEnabled = () => {
  return enabled && highlight_handle_time;
};

export const getHTWarningThreshold = () => {
  return handle_time_warning_threshold;
};

export const getHTExceededThreshold = () => {
  return handle_time_exceeded_threshold;
};

export const isDisplayTaskQueueNameEnabled = () => {
  return enabled && display_task_queue_name;
};
