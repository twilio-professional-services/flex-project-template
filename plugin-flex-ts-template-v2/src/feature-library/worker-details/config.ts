import { getFeatureFlags } from '../../utils/configuration';
import WorkerDetailsConfig from './types/ServiceConfiguration';

const {
  enabled = false,
  edit_team = true,
  edit_department = true,
  custom_attributes = ['location', 'manager_name'],
} = (getFeatureFlags()?.features?.worker_details as WorkerDetailsConfig) || {};

const { teams = [], departments = [] } = getFeatureFlags().common || {};

export const isFeatureEnabled = () => {
  return enabled;
};
export const editTeam = () => {
  return edit_team;
};
export const editDepartment = () => {
  return edit_department;
};
export const getCustomAttributes = () => {
  return custom_attributes;
};
export const getTeams = () => {
  return teams;
};
export const getDepartments = () => {
  return departments;
};
