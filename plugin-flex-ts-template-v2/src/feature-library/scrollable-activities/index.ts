import { getFeatureFlags } from '../../utils/configuration';
import ScrollableActivitiesConfig from './types/ServiceConfiguration';
import { FeatureDefinition } from "../../types/feature-loader";
// @ts-ignore
import hooks from "./flex-hooks/**/*.*";

const { enabled = false } = getFeatureFlags()?.features?.scrollable_activities as ScrollableActivitiesConfig || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const register = (): FeatureDefinition => {
  if (!isFeatureEnabled()) return {};
  return { name: "scrollable-activities", hooks };
};
