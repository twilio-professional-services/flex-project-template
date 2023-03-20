import { getFeatureFlags } from '../../utils/configuration';
import ScheduleManagerConfig from './types/ServiceConfiguration';

const { enabled = false, serverless_domain } =
  (getFeatureFlags()?.features?.schedule_manager as ScheduleManagerConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const getServerlessDomain = () => {
  return serverless_domain;
};
