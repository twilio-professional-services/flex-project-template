export default interface TeamsViewEnhancementsConfig {
  enabled: boolean;
  highlight_handle_time: boolean;
  handle_time_warning_threshold: number;
  handle_time_exceeded_threshold: number;
  columns: {
    team: boolean;
    department: boolean;
    location: boolean;
    activity_icon: boolean;
  };
}
