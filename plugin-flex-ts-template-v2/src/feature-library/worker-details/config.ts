import { getFeatureFlags } from '../../utils/configuration';
import WorkerDetailsConfig from './types/ServiceConfiguration';

const {
  enabled = false,
  edit_team = true,
  edit_department = true,
  edit_location = true,
  edit_manager = false,
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
export const editLocation = () => {
  return edit_location;
};
export const editManager = () => {
  return edit_manager;
};
export const getTeams = () => {
  return teams;
};
export const getDepartments = () => {
  return departments;
};
