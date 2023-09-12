import { getFeatureFlags } from '../../utils/configuration';
import SipMuteConfig from './types/ServiceConfiguration';

const { enabled = false } = (getFeatureFlags()?.features?.sip_mute as SipMuteConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};
