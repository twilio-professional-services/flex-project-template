import { getFeatureFlags } from '../../utils/configuration';
import PostCallSurveyConfig from './types/ServiceConfiguration';

const {
  enabled = false,
  survey_definitions_map_name = 'Post Call Survey Definitions',
  rule_definitions_map_name = 'Post Call Survey Rules',
} = (getFeatureFlags()?.features?.post_call_survey as PostCallSurveyConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const getSurveyDefinitionsMapName = () => {
  return survey_definitions_map_name;
};
export const getRuleDefinitionsMapName = () => {
  return rule_definitions_map_name;
};
