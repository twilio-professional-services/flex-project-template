import { getFeatureFlags } from '../../utils/configuration';
import InlineMediaConfig from './types/ServiceConfiguration';

const { enabled = false } = (getFeatureFlags()?.features?.inline_media as InlineMediaConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};
