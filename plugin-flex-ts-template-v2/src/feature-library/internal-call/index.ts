import { getFeatureFlags } from '../../utils/configuration';
import InternalCallConfig from './types/ServiceConfiguration';
import { FeatureDefinition } from "../../types/feature-loader";
// @ts-ignore
import hooks from "./flex-hooks/**/*.*";

const { enabled = false } = getFeatureFlags()?.features?.internal_call as InternalCallConfig || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const register = (): FeatureDefinition => {
  if (!isFeatureEnabled()) return {};
  return { name: "internal-call", hooks: typeof hooks === 'undefined' ? [] : hooks };
};
