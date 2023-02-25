import { loadFeature } from '../../utils/feature-loader';
import { isFeatureEnabled } from './config';
// @ts-ignore
import hooks from "./flex-hooks/**/*.*";

export const register = () => {
  if (!isFeatureEnabled()) return;
  loadFeature("activity-skill-filter", hooks);
};