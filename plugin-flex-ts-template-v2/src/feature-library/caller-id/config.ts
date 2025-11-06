import { getFeatureFlags } from '../../utils/configuration';
import CallerIdConfig from './types/ServiceConfiguration';

const { enabled = false, include_outgoing_only_numbers = true } =
  (getFeatureFlags()?.features?.caller_id as CallerIdConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const isOutgoingOnlyNumbersEnabled = () => {
  return include_outgoing_only_numbers;
};
