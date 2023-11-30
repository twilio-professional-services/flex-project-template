import { getFeatureFlags } from '../../utils/configuration';

const { enabled = false } = getFeatureFlags()?.features?.worker_canvas_tabs || {};

export const isFeatureEnabled = () => {
  return enabled;
};
