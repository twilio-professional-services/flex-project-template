import { getFeatureFlags } from '../../utils/configuration';

const { enabled = false, filter_teams_view = false, rules } = getFeatureFlags()?.features?.activity_skill_filter || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const isFilterTeamsViewEnabled = () => {
  return enabled && filter_teams_view;
};

export const getRules = () => {
  return rules;
};