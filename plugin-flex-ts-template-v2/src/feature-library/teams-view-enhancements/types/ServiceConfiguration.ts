export default interface TeamsViewEnhancementsConfig {
  enabled: boolean;
  channels: Channels;
  task_summary: boolean;
  team_activity: boolean;
  idle_status_color: string;
  busy_status_color: string;
  highlight_handle_time: boolean;
  handle_time_warning_threshold: number;
  handle_time_exceeded_threshold: number;
  display_task_queue_name: boolean;
  columns: {
    team: boolean;
    department: boolean;
    location: boolean;
    agent_skills: boolean;
    capacity: boolean;
  };
}

export interface Channels {
  [key: string]: { color: string; taskCount: boolean };
}
