import { getFeatureFlags } from '../../utils/configuration';
import MultiCallConfig from './types/ServiceConfiguration';
import { FeatureDefinition } from "../../types/feature-loader";
// @ts-ignore
import hooks from "./flex-hooks/**/*.*";

const { enabled = false } = getFeatureFlags()?.features?.multi_call as MultiCallConfig || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const register = (): FeatureDefinition => {
  if (!isFeatureEnabled()) return {};
  return { name: "multi-call", hooks: typeof hooks === 'undefined' ? [] : hooks };
};