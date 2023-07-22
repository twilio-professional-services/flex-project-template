import { getFeatureFlags } from '../../utils/configuration';
import TeamsViewEnhancementsConfig from './types/ServiceConfiguration';

const { enabled = false } = (getFeatureFlags()?.features?.teams_view_enhancements as TeamsViewEnhancementsConfig) || {};

const {
  team = true,
  department = true,
  location = false,
  agent_skills = true,
} = getFeatureFlags().features?.teams_view_enhancements?.columns || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const isTeamColumnEnabled = () => {
  return enabled && team;
};

export const isDepartmentColumnEnabled = () => {
  return enabled && department;
};

export const isLocationColumnEnabled = () => {
  return enabled && location;
};

export const isAgentSkillsColumnEnabled = () => {
  return enabled && agent_skills;
};
