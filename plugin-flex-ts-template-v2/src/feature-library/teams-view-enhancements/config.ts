import { getFeatureFlags } from '../../utils/configuration';
import TeamsViewEnhancementsConfig from './types/ServiceConfiguration';

const {
  enabled = false,
  channels = {
    voice: {
      color: '#ADD8E6',
      taskCount: true,
    },
    chat: {
      color: '#87CEFA',
      taskCount: true,
    },
    sms: {
      color: '#59cef8',
      taskCount: true,
    },
    video: {
      color: '#00CED1',
      taskCount: true,
    },
  },
  task_summary = false,
  team_activity = false,
  idle_status = { color: 'limegreen' },
  busy_status = { color: 'royalblue' },
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
export const getChannelVoice_Color = () => {
  return channels.voice.color;
};
export const getChannelChat_Color = () => {
  return channels.chat.color;
};
export const getChannelSMS_Color = () => {
  return channels.sms.color;
};
export const getChannelVideo_Color = () => {
  return channels.video.color;
};
export const isTaskSummaryEnabled = () => {
  return task_summary;
};
export const isTeamActivityEnabled = () => {
  return team_activity;
};
export const getIdleStatusConfig = () => {
  return idle_status;
};
export const getBusyStatusConfig = () => {
  return busy_status;
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
