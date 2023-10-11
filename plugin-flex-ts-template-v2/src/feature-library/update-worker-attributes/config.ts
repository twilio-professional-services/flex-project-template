import { getFeatureFlags } from '../../utils/configuration';
import UpdateWorkerAttributesConfig from './types/ServiceConfiguration';

const { enabled = false } =
  (getFeatureFlags()?.features?.update_worker_attributes as UpdateWorkerAttributesConfig) || {};

const { teams = [], departments = [] } = getFeatureFlags().common || {};

export const isFeatureEnabled = () => {
  return enabled;
};
export const getTeams = () => {
  return teams;
};
export const getDepartments = () => {
  return departments;
};
