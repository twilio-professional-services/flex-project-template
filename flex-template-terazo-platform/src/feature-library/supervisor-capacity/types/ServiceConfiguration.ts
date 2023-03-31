export type SupervisorCapacityRule = {
  min: number;
  max: number;
};

export type SupervisorCapacityRules = {
  [key: string]: SupervisorCapacityRule;
};

export default interface SupervisorCapacityConfig {
  enabled: boolean;
  rules: SupervisorCapacityRules | null;
}
