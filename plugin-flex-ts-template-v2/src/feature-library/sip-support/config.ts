import { getFeatureFlags } from '../../utils/configuration';
import SipSupportConfig from './types/ServiceConfiguration';

const { enabled = false } = (getFeatureFlags()?.features?.sip_support as SipSupportConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};
