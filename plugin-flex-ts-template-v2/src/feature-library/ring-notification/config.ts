import { getFeatureFlags } from '../../utils/configuration';
import RingNotificationConfig from './types/ServiceConfiguration';

const { enabled = false } = (getFeatureFlags()?.features?.ring_notification as RingNotificationConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};
