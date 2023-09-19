export default interface TeamsViewEnhancementsConfig {
  enabled: boolean;
  task_summary: boolean;
  team_activity: boolean;
  team_names: string[];
  highlight_handle_time: boolean;
  handle_time_warning_threshold: number;
  handle_time_exceeded_threshold: number;
  display_task_queue_name: boolean;
  columns: {
    team: boolean;
    department: boolean;
    location: boolean;
    agent_skills: boolean;
  };
}
