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
    tasks: {
      [key: string]: number;
    };
  };
}

export interface TasksAndCapacity {
  tasks: {
    [key: string]: number;
  };
  capacity: {
    [key: string]: number;
  };
}
