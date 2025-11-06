import { getFeatureFlags, getFlexFeatureFlag } from '../../utils/configuration';
import ConferenceConfig from './types/ServiceConfiguration';

const { enabled = false, hold_workaround = false } =
  (getFeatureFlags()?.features?.conference as ConferenceConfig) || {};

const nativeXwtEnabled = getFlexFeatureFlag('external-warm-transfers');

export const isFeatureEnabled = () => {
  return enabled;
};

export const isConferenceEnabledWithoutNativeXWT = () => {
  return enabled && !nativeXwtEnabled;
};

export const isHoldWorkaroundEnabled = () => {
  return enabled && hold_workaround;
};
