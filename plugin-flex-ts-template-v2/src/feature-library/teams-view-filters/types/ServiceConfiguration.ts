export default interface TeamViewFiltersConfig {
  enabled: boolean;
  logFilters: boolean;
  applied_filters: {
    email: boolean;
    department: boolean;
    queuePartial: boolean;
    team: boolean;
    agent_skills: boolean;
  }
  department_options: Array<String>;
  team_options: Array<String>;
}
