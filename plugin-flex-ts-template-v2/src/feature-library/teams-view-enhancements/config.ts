import { getFeatureFlags } from '../../utils/configuration';
import TeamsViewEnhancementsConfig from './types/ServiceConfiguration';

const {
  enabled = false,
  channels = {
    Voice: {
      color: '#ADD8E6',
      taskCount: true,
    },
    Chat: {
      color: '#87CEFA',
      taskCount: true,
    },
    SMS: {
      color: '#59cef8',
      taskCount: true,
    },
    Video: {
      color: '#00CED1',
      taskCount: false,
    },
  },
  task_summary = false,
  team_activity = false,
  idle_status_color = 'limegreen',
  busy_status_color = 'royalblue',
  highlight_handle_time = true,
  handle_time_warning_threshold = 180,
  handle_time_exceeded_threshold = 300,
  display_task_queue_name = true,
} = (getFeatureFlags()?.features?.teams_view_enhancements as TeamsViewEnhancementsConfig) || {};

const {
  team = true,
  department = false,
  location = false,
  agent_skills = true,
} = getFeatureFlags().features?.teams_view_enhancements?.columns || {};

const { teams = [] } = getFeatureFlags().common || {};

const defaultActivities = {
  activities: {
    Available: { color: 'green', icon: 'Accept' },
    Outbound: { color: 'darkgreen', icon: 'Call' },
    Break: { color: 'goldenrod', icon: 'Hold' },
    Lunch: { color: 'darkorange', icon: 'Hamburger' },
    Training: { color: 'red', icon: 'Bulb' },
    Offline: { color: 'grey', icon: 'Minus' },
  },
  other: { color: 'darkred', icon: 'More' },
};

const { agentActivityConfiguration = defaultActivities } = getFeatureFlags()?.features?.queues_view_data_tiles || {};

export const isFeatureEnabled = () => {
  return enabled;
};
export const getChannelsConfig = () => {
  return channels;
};
export const getEnabledChannels = () => {
  const enabledChannels: string[] = [];
  const channelsNames = Object.keys(channels);
  channelsNames.forEach((ch) => {
    if (channels[ch].taskCount) enabledChannels.push(ch);
  });
  return enabledChannels;
};
export const isTaskSummaryEnabled = () => {
  return task_summary;
};
export const isTeamActivityEnabled = () => {
  return team_activity;
};
export const getIdleStatusColor = () => {
  return idle_status_color;
};
export const getBusyStatusColor = () => {
  return busy_status_color;
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
export const getAgentActivityConfig = () => {
  return agentActivityConfiguration;
};
export const getTeams = () => {
  return teams;
};
