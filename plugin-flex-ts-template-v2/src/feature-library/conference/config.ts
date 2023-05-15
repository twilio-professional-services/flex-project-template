import * as Flex from '@twilio/flex-ui';

import { getFeatureFlags } from '../../utils/configuration';
import ConferenceConfig from './types/ServiceConfiguration';

const { enabled = false, hold_workaround = false } =
  (getFeatureFlags()?.features?.conference as ConferenceConfig) || {};

const nativeXwtEnabled =
  Flex.Manager.getInstance().store.getState().flex.featureFlags.features['external-warm-transfers']?.enabled === true;

export const isFeatureEnabled = () => {
  return enabled;
};

export const isConferenceEnabledWithoutNativeXWT = () => {
  return enabled && !nativeXwtEnabled;
};

export const isHoldWorkaroundEnabled = () => {
  return enabled && hold_workaround;
};
