import { getFeatureFlags } from '../../utils/configuration';
import TeamsViewEnhancementsConfig from './types/ServiceConfiguration';

const { enabled = false } = (getFeatureFlags()?.features?.teams_view_enhancements as TeamsViewEnhancementsConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};
