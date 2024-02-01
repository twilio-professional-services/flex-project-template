import { getFeatureFlags } from '../../utils/configuration';
import WorkerDetailsConfig from './types/ServiceConfiguration';

const {
  enabled = false,
  edit_team = true,
  edit_department = true,
  text_attributes = ['location', 'manager'],
  boolean_attributes = ['auto_accept', 'auto_wrapup'],
} = (getFeatureFlags()?.features?.worker_details as WorkerDetailsConfig) || {};

const { teams = [], departments = [] } = getFeatureFlags().common || {};

const { enabled: workerCanvasTabsEnabled = false } = getFeatureFlags()?.features?.worker_canvas_tabs || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const editTeam = () => {
  return edit_team;
};

export const editDepartment = () => {
  return edit_department;
};

export const getTextAttributes = () => {
  return text_attributes;
};

export const getBooleanAttributes = () => {
  return boolean_attributes;
};

export const getTeams = () => {
  return teams;
};

export const getDepartments = () => {
  return departments;
};

export const isWorkerCanvasTabsEnabled = () => {
  return workerCanvasTabsEnabled;
};
