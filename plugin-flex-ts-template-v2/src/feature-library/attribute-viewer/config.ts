import { getFeatureFlags } from '../../utils/configuration';
import AttributeViewerConfig from './types/ServiceConfiguration';

const { enabled = false } = (getFeatureFlags()?.features?.attribute_viewer as AttributeViewerConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};
