import { getFeatureFlags } from '../../utils/configuration';
import EnhancedCRMContainerConfig from './types/ServiceConfiguration';

const {
  enabled = false,
  enable_url_tab = false,
  url_tab_title = '',
  url = '',
  should_display_url_when_no_tasks = false,
  display_url_when_no_tasks = '',
} = (getFeatureFlags()?.features?.enhanced_crm_container as EnhancedCRMContainerConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const shouldDisplayUrlWhenNoTasks = () => {
  return should_display_url_when_no_tasks;
};

export const displayUrlWhenNoTasks = () => {
  return display_url_when_no_tasks;
};

export const getUrl = () => {
  return url;
};

export const isUrlTabEnabled = () => {
  return enable_url_tab;
};

export const getUrlTabTitle = () => {
  return url_tab_title;
};
