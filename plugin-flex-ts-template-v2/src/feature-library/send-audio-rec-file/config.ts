import { getFeatureFlags } from '../../utils/configuration';
import SendAudioRecFileConfig from './types/ServiceConfiguration';

const { enabled = false } = (getFeatureFlags()?.features?.send_audio_rec_file as SendAudioRecFileConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};
