export default interface QueuesViewDataTilesConfig {
  enabled: boolean;
  activeTasksDataTile: boolean;
  waitingTasksDataTile: boolean;
  longestWaitTimeDataTile: boolean;
  agentsByActivityBarChart: boolean;
  allChannelsDataTile: boolean;
  enhancedAgentByActivityPieChart: boolean;
  channels: Channels;
  agentActivityConfiguration: {
    [key: string]: ActivityConfig;
  };
  queuesStatsColumns: {
    assignedTasksColumn: boolean;
    wrappingTasksColumn: boolean;
  };
}

export interface Channels {
  [key: string]: ChannelConfig;
}

export interface ChannelConfig {
  color: string;
  SLADataTile: boolean;
  taskCountsDataTile: boolean;
}

interface ActivityConfig {
  color: string;
  icon: string;
}
