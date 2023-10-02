export interface ActivityCounts {
  [key: string]: {
    teamName: string;
    totalAgentCount: number;
    activities: {
      [key: string]: number;
    };
  };
}

export interface TaskCounts {
  [key: string]: {
    teamName: string;
    totalTaskCount: number;
    tasks: {
      [key: string]: number;
    };
  };
}
