import { getFeatureFlags } from '../../utils/configuration';
import SalesforceIntegrationConfig from './types/ServiceConfiguration';

const {
  enabled = false,
  activity_logging = false,
  click_to_dial = false,
  copilot_notes = false,
  hide_crm_container = false,
  prevent_popout_during_call = false,
  screen_pop = false,
  show_panel_automatically = false,
  utility_bar_status = false,
} = (getFeatureFlags()?.features?.salesforce_integration as SalesforceIntegrationConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const isActivityLoggingEnabled = () => {
  return activity_logging;
};

export const isClickToDialEnabled = () => {
  return click_to_dial;
};

export const isCopilotNotesEnabled = () => {
  return copilot_notes;
};

export const isHideCrmContainerEnabled = () => {
  return hide_crm_container;
};

export const isPreventPopoutEnabled = () => {
  return prevent_popout_during_call;
};

export const isScreenPopEnabled = () => {
  return screen_pop;
};

export const isShowPanelAutomaticallyEnabled = () => {
  return show_panel_automatically;
};

export const isUtilityBarStatusEnabled = () => {
  return utility_bar_status;
};
