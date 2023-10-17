import { getFeatureFlags } from '../../utils/configuration';
import WorkerDetailsConfig from './types/ServiceConfiguration';

const {
  enabled = false,
  edit_team = true,
  edit_department = true,
  edit_location = true,
  edit_manager = false,
  edit_unit_leader = true,
  edit_coach = true,
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
export const editUnitLeader = () => {
  return edit_unit_leader;
};
export const editCoach = () => {
  return edit_coach;
};

export const getTeams = () => {
  return teams;
};
export const getDepartments = () => {
  return departments;
};
