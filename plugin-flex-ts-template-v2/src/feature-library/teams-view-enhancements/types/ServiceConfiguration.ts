export default interface TeamsViewEnhancementsConfig {
  enabled: boolean;
  columns: {
    team: boolean;
    department: boolean;
    location: boolean;
    agent_skills: boolean;
  };
}
