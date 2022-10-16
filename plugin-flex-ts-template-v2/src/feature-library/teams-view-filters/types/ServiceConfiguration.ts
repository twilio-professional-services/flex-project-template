export default interface TeamViewFiltersConfig {
  enabled: boolean;
  applied_filters: {
    email: boolean;
    department: boolean;
    queue: boolean;
    team: boolean;
    agent_skills: boolean;
  }
  department_options: Array<String>;
  team_options: Array<String>;
}
