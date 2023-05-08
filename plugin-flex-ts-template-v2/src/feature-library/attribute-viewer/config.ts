import { getFeatureFlags } from '../../utils/configuration';
import AttributeViewerConfig from './types/ServiceConfiguration';

const { enabled = false, enabled_for_agents = false } =
  (getFeatureFlags()?.features?.attribute_viewer as AttributeViewerConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const isEnabledForAgents = () => {
  return enabled_for_agents;
};
