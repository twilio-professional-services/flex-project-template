export default interface DataTilesConfig {
  enabled: boolean;
  queuesViewTiles: {
    activeTasksDataTile: boolean;
    waitingTasksDataTile: boolean;
    longestWaitTimeDataTile: boolean;
    agentsByActivityBarChart: boolean;
    allChannelsDataTile: boolean;
    enhancedAgentByActivityPieChart: boolean;
  };
  teamsViewTiles: {
    taskSummaryTile: boolean;
    teamActivityTile: boolean;
    statusIdleColor: string;
    statusBusyColor: string;
  };
  channels: Channels;
  agentActivityConfiguration: {
    activities: {
      [key: string]: ActivityConfig;
    };
    other: ActivityConfig;
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
  teamsTaskSummaryColumn: boolean;
}

interface ActivityConfig {
  color: string;
  icon: string;
}
