import { getFeatureFlags } from '../../utils/configuration';

const { enabled = false, serverless_domain } = getFeatureFlags()?.features?.schedule_manager || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const getServerlessDomain = () => {
  return serverless_domain;
};
