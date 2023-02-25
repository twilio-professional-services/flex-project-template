import { isFeatureEnabled } from './config';
import { loadFeature } from '../../utils/feature-loader';
// @ts-ignore
import hooks from "./flex-hooks/**/*.*";

export const register = () => {
  if (!isFeatureEnabled()) return;
  loadFeature("supervisor-capacity", hooks);
};
