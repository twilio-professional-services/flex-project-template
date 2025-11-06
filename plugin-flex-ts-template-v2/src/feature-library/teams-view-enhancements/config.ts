import { getFeatureFlags } from '../../utils/configuration';
import TeamsViewEnhancementsConfig from './types/ServiceConfiguration';

const {
  enabled = false,
  highlight_handle_time = true,
  handle_time_warning_threshold = 180,
  handle_time_exceeded_threshold = 300,
} = (getFeatureFlags()?.features?.teams_view_enhancements as TeamsViewEnhancementsConfig) || {};

const {
  team = true,
  department = false,
  location = false,
  activity_icon = false,
} = getFeatureFlags().features?.teams_view_enhancements?.columns || {};

const {
  agent_activity_configuration = {
    activities: {
      Available: { color: 'green', icon: 'Accept' },
      Outbound: { color: 'darkgreen', icon: 'Call' },
      Break: { color: 'goldenrod', icon: 'Hold' },
      Lunch: { color: 'darkorange', icon: 'Hamburger' },
      Training: { color: 'red', icon: 'Bulb' },
      Offline: { color: 'grey', icon: 'Minus' },
    },
    other: { color: 'darkred', icon: 'More' },
  },
} = (getFeatureFlags()?.features?.metrics_data_tiles as any) || {};

const { teams = [] } = getFeatureFlags().common || {};

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
export const isActivityIconEnabled = () => {
  return enabled && activity_icon;
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

export const getTeams = () => {
  return teams;
};
export const getAgentActivityConfig = () => {
  return agent_activity_configuration;
};
