import { getFeatureFlags } from '../../utils/configuration';
import { FeatureDefinition } from "../../types/feature-loader";
// @ts-ignore
import hooks from "./flex-hooks/**/*.*";
import HangUpByConfig from './types/ServiceConfiguration';

const { enabled = false } = getFeatureFlags()?.features?.hang_up_by as HangUpByConfig || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const register = (): FeatureDefinition => {
  if (!isFeatureEnabled()) return {};
  return { name: "hang-up-by", hooks: typeof hooks === 'undefined' ? [] : hooks };
};
