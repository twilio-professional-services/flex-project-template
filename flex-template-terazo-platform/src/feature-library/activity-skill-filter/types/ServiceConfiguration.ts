export type ActivitySkillFilterRule = {
  required_skill: string;
  sort_order: number;
};

export type ActivitySkillFilterRules = {
  [key: string]: ActivitySkillFilterRule;
};

export default interface ActivitySkillFilterConfig {
  enabled: boolean;
  filter_teams_view: boolean;
  rules: ActivitySkillFilterRules;
}
