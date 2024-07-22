import { getFeatureFlags } from '../../utils/configuration';
import ForceConferenceRegionConfig from './types/ServiceConfiguration';

const { enabled = false, region } =
  (getFeatureFlags()?.features?.force_conference_region as ForceConferenceRegionConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const getRegion = () => {
  return region;
};
