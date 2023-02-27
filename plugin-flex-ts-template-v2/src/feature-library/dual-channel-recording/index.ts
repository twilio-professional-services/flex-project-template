import { getFeatureFlags } from '../../utils/configuration';
import DualChannelRecordingConfig from './types/ServiceConfiguration';
import { FeatureDefinition } from "../../types/feature-loader";
// @ts-ignore
import hooks from "./flex-hooks/**/*.*";

const { enabled = false, channel } = getFeatureFlags()?.features?.dual_channel_recording as DualChannelRecordingConfig || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const getChannelToRecord = () => {
  return channel;
};

export const register = (): FeatureDefinition => {
  if (!isFeatureEnabled()) return {};
  return { name: "dual-channel-recording", hooks };
};
