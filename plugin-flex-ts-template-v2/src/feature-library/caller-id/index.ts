import { getFeatureFlags } from '../../utils/configuration';
import { FeatureDefinition } from "../../types/feature-loader";
// @ts-ignore
import hooks from "./flex-hooks/**/*.*";
import CallerIdConfig from './types/ServiceConfiguration';

const { enabled = false } = getFeatureFlags()?.features?.caller_id as CallerIdConfig || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const register = (): FeatureDefinition => {
  if (!isFeatureEnabled()) return {};
  return { name: "caller-id", hooks: typeof hooks === 'undefined' ? [] : hooks };
};
