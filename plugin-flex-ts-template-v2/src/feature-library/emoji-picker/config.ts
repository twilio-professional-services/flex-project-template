import { getFeatureFlags } from '../../utils/configuration';
import EmojiPickerConfig from './types/ServiceConfiguration';

const { enabled = false } = (getFeatureFlags()?.features?.emoji_picker as EmojiPickerConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};
