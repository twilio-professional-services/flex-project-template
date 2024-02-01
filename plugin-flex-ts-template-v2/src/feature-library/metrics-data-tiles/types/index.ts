export interface ChannelTaskCounts {
  activeTasks: number;
  waitingTasks: number;
  assignedTasks: number;
  wrappingTasks: number;
}

export interface TaskCounts {
  [channel: string]: ChannelTaskCounts;
}

export interface ChannelSLMetrics {
  handledTasks: number;
  handledTasksWithinSL: number;
  serviceLevelPct: number;
}

export interface SLMetrics {
  [channel: string]: ChannelSLMetrics;
}

export interface TeamActivityCounts {
  [key: string]: {
    teamName: string;
    totalAgentCount: number;
    activities: {
      [key: string]: number;
    };
  };
}

export interface TeamTaskCounts {
  [key: string]: {
    teamName: string;
    totalTaskCount: number;
    tasks: {
      [key: string]: number;
    };
  };
}
