import { getFeatureFlags } from '../../utils/configuration';
import TeamViewFiltersConfig from './types/ServiceConfiguration';

const {
  enabled = false,
  log_filters = false,
  department_options = [],
  team_options = [],
} = (getFeatureFlags().features?.teams_view_filters as TeamViewFiltersConfig) || {};
const {
  activities = true,
  email = false,
  department = false,
  queue_no_worker_data = false,
  queue_worker_data = false,
  team = false,
  agent_skills = false,
} = getFeatureFlags().features?.teams_view_filters?.applied_filters || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const shouldLogFilters = () => {
  return enabled && log_filters;
};

export const isActivitiesFilterEnabled = () => {
  return enabled && activities;
};

export const isEmailFilterEnabled = () => {
  return enabled && email;
};

export const isDepartmentFilterEnabled = () => {
  return enabled && department;
};

export const isQueueNoWorkerDataFilterEnabled = () => {
  return enabled && queue_no_worker_data;
};

export const isQueueWorkerDataFilterEnabled = () => {
  return enabled && queue_worker_data;
};

export const isTeamFilterEnabled = () => {
  return enabled && team;
};

export const isAgentSkillsFilterEnabled = () => {
  return enabled && agent_skills;
};

export const getDepartmentOptions = () => {
  return department_options;
};

export const getTeamOptions = () => {
  return team_options;
};
