import { getFeatureFlags } from '../../utils/configuration';
import ScrollableActivitiesConfig from './types/ServiceConfiguration';
import { loadFeature } from '../../utils/feature-loader';
// @ts-ignore
import hooks from "./flex-hooks/**/*.*";

const { enabled = false } = getFeatureFlags()?.features?.scrollable_activities as ScrollableActivitiesConfig || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const register = () => {
  if (!isFeatureEnabled()) return;
  loadFeature("scrollable-activities", hooks);
};
