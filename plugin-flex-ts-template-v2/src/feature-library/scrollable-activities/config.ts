import { getFeatureFlags } from '../../utils/configuration';
import ScrollableActivitiesConfig from './types/ServiceConfiguration';

const { enabled = false } = (getFeatureFlags()?.features?.scrollable_activities as ScrollableActivitiesConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};
