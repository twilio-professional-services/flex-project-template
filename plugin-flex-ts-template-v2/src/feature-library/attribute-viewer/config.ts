import { getFeatureFlags } from '../../utils/configuration';
import AttributeViewerConfig from './types/ServiceConfiguration';

const { enabled = false, enabled_for_agents = false } =
  (getFeatureFlags()?.features?.attribute_viewer as AttributeViewerConfig) || {};

const { enabled: workerCanvasTabsEnabled = false } = getFeatureFlags()?.features?.worker_canvas_tabs || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const isEnabledForAgents = () => {
  return enabled_for_agents;
};

export const isWorkerCanvasTabsEnabled = () => {
  return workerCanvasTabsEnabled;
};
