import { getFeatureFlags } from '../../utils/configuration';
import QueuesViewDataTilesConfig from './types/ServiceConfiguration';

const {
  enabled = false,
  activeTasksDataTile = false,
  waitingTasksDataTile = false,
  longestWaitTimeDataTile = false,
  agentsByActivityBarChart = true,
  channels = {
    voice: {
      color: '#ADD8E6',
      SLADataTile: true,
      taskCountsDataTile: true,
    },
    chat: {
      color: '#87CEFA',
      SLADataTile: false,
      taskCountsDataTile: false,
    },
    sms: {
      color: '#59cef8',
      SLADataTile: true,
      taskCountsDataTile: true,
    },
    video: {
      color: '#00CED1',
      SLADataTile: false,
      taskCountsDataTile: false,
    },
  },
  allChannelsDataTile = false,
  enhancedAgentByActivityPieChart = false,
  agentActivityConfiguration = {
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
} = (getFeatureFlags()?.features?.queues_view_data_tiles as QueuesViewDataTilesConfig) || {};

const { assignedTasksColumn = true, wrappingTasksColumn = true } =
  getFeatureFlags()?.features?.queues_view_data_tiles?.queuesStatsColumns || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const isActiveTasksEnabled = () => {
  return activeTasksDataTile;
};
export const isWaitingTasksEnabled = () => {
  return waitingTasksDataTile;
};
export const isLongestWaitTimeEnabled = () => {
  return longestWaitTimeDataTile;
};
export const isAgentsByActivityEnabled = () => {
  return agentsByActivityBarChart;
};
export const getChannelColors = () => {
  const channelNames = Object.keys(channels);
  const colors: { [key: string]: string } = {};
  channelNames.forEach((ch) => {
    colors[ch] = channels[ch].color;
  });
  return colors;
};
export const getChannelNames = () => {
  return Object.keys(channels);
};
export const getChannelVoice_Color = () => {
  return channels?.voice?.color;
};
export const getChannelChat_Color = () => {
  return channels?.chat?.color;
};
export const getChannelSMS_Color = () => {
  return channels?.sms?.color;
};
export const isChannelVoice_CountsEnabled = () => {
  return channels?.voice?.taskCountsDataTile;
};
export const isChannelChat_CountsEnabled = () => {
  return channels?.chat?.taskCountsDataTile;
};
export const isChannelSMS_CountsEnabled = () => {
  return channels?.sms?.taskCountsDataTile;
};
export const isChannelVoice_SLAEnabled = () => {
  return channels?.voice?.SLADataTile;
};
export const isChannelChat_SLAEnabled = () => {
  return channels?.chat?.SLADataTile;
};
export const isChannelSMS_SLAEnabled = () => {
  return channels?.sms?.SLADataTile;
};
export const isAllChannels_SLAEnabled = () => {
  return allChannelsDataTile;
};
export const isEnhancedAgentsByActivityPieChartEnabled = () => {
  return enhancedAgentByActivityPieChart;
};
export const getAgentActivityConfig = () => {
  return agentActivityConfiguration;
};
export const isAssignedTasksColumnEnabled = () => {
  return assignedTasksColumn;
};
export const isWrappingTasksColumnEnabled = () => {
  return wrappingTasksColumn;
};
