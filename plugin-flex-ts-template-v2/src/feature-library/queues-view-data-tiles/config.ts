import { getFeatureFlags } from '../../utils/configuration';
import DataTilesConfig from './types/ServiceConfiguration';

const {
  enabled = false,
  queues_view_tiles = {
    active_tasks_data_tile: false,
    waiting_tasks_data_tile: false,
    longest_wait_time_data_tile: false,
    agents_by_activity_bar_chart: false,
    all_channels_data_tile: false,
    enhanced_agent_by_activity_pie_chart: true,
  },
  teams_view_tiles = {
    task_summary_tile: false,
    team_activity_tile: false,
    status_idle_color: 'limegreen',
    status_busy_color: 'royalblue',
  },
  channels = {
    Voice: {
      color: '#ADD8E6',
      SLA_data_tile: true,
      task_counts_data_tile: true,
      teams_task_summary: true,
    },
    Chat: {
      color: '#87CEFA',
      SLA_data_tile: true,
      task_counts_data_tile: true,
      teams_task_summary: true,
    },
    SMS: {
      color: '#59cef8',
      SLA_data_tile: false,
      task_counts_data_tile: false,
      teams_task_summary: true,
    },
    Video: {
      color: '#00CED1',
      SLA_data_tile: false,
      task_counts_data_tile: false,
      teams_task_summary: false,
    },
  },

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
} = (getFeatureFlags()?.features?.metrics_data_tiles as DataTilesConfig) || {};

const { teams = [] } = getFeatureFlags().common || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const isActiveTasksEnabled = () => {
  return queues_view_tiles.active_tasks_data_tile;
};
export const isWaitingTasksEnabled = () => {
  return queues_view_tiles.waiting_tasks_data_tile;
};
export const isLongestWaitTimeEnabled = () => {
  return queues_view_tiles.longest_wait_time_data_tile;
};
export const isAgentsByActivityEnabled = () => {
  return queues_view_tiles.agents_by_activity_bar_chart;
};
export const getChannelColors = () => {
  const channelNames = Object.keys(channels);
  const colors: { [key: string]: string } = {};
  channelNames.forEach((ch) => {
    colors[ch.toLowerCase()] = channels[ch].color;
  });
  return colors;
};
export const getChannelsConfig = () => {
  return channels;
};
export const getTaskCountsTileChannels = () => {
  const enabledChannels: string[] = [];
  const channelsNames = Object.keys(channels);
  channelsNames.forEach((ch) => {
    if (channels[ch].task_counts_data_tile) enabledChannels.push(ch);
  });
  return enabledChannels;
};
export const getSLATileChannels = () => {
  const enabledChannels: string[] = [];
  const channelsNames = Object.keys(channels);
  channelsNames.forEach((ch) => {
    if (channels[ch].SLA_data_tile) enabledChannels.push(ch);
  });
  return enabledChannels;
};

export const getTaskSummaryChannels = () => {
  const enabledChannels: string[] = [];
  const channelsNames = Object.keys(channels);
  channelsNames.forEach((ch) => {
    if (channels[ch].teams_task_summary) enabledChannels.push(ch);
  });
  return enabledChannels;
};

export const isAllChannels_SLAEnabled = () => {
  return queues_view_tiles.all_channels_data_tile;
};
export const isEnhancedAgentsByActivityPieChartEnabled = () => {
  return queues_view_tiles.enhanced_agent_by_activity_pie_chart;
};
export const getAgentActivityConfig = () => {
  return agent_activity_configuration;
};

export const isTaskSummaryEnabled = () => {
  return teams_view_tiles.task_summary_tile;
};
export const isTeamActivityEnabled = () => {
  return teams_view_tiles.team_activity_tile;
};
export const getIdleStatusColor = () => {
  return teams_view_tiles.status_idle_color;
};
export const getBusyStatusColor = () => {
  return teams_view_tiles.status_busy_color;
};
export const getTeams = () => {
  return teams;
};
