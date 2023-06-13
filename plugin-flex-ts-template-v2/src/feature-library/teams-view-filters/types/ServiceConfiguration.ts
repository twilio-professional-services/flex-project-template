export default interface TeamViewFiltersConfig {
  enabled: boolean;
  log_filters: boolean;
  applied_filters: {
    email: boolean;
    department: boolean;
    queue_no_worker_data: boolean;
    queue_worker_data: boolean;
    team: boolean;
    agent_skills: boolean;
  };
  department_options: Array<string>;
  team_options: Array<string>;
}
