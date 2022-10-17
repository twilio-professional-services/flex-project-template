import * as Flex from "@twilio/flex-ui";
import { UIAttributes } from "types/manager/ServiceConfiguration";

const { custom_data } =
  (Flex.Manager.getInstance().serviceConfiguration
    .ui_attributes as UIAttributes) || {};
const { enabled = false } = custom_data?.features?.teams_view_filters || {};
const { logFilters = false } = custom_data?.features?.teams_view_filters || {};

const { email = false } = custom_data?.features?.teams_view_filters.applied_filters || {};
const { department = false } = custom_data?.features?.teams_view_filters.applied_filters || {};
const { queue_no_worker_data = false } = custom_data?.features?.teams_view_filters.applied_filters || {};
const { queue_worker_data = false } = custom_data?.features?.teams_view_filters.applied_filters || {};
const { team = false } = custom_data?.features?.teams_view_filters.applied_filters || {};
const { agent_skills = false } = custom_data?.features?.teams_view_filters.applied_filters || {};

const { department_options = [] } = custom_data?.features?.teams_view_filters || {};
const { team_options = [] } = custom_data?.features?.teams_view_filters || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const shouldLogFilters = () => {
  return enabled && logFilters;
};

export const isExtensionsFilterEnabled = () => {
  return enabled && email;
}

export const isDepartmentFilterEnabled = () => {
  return enabled && department;
}

export const isQueueNoWorkerDataFilterEnabled = () => {
  return enabled && queue_no_worker_data;
}

export const isQueueWorkerDataFilterEnabled = () => {
  return enabled && queue_worker_data;
}

export const isTeamFilterEnabled = () => {
  return enabled && team;
}

export const isAgnetSkillsFilterEnabled = () => {
  return enabled && agent_skills;
}

export const getDepartmentOptions = () => {
  return department_options;
}

export const getTeamOptions = () => {
  return team_options;
}
