import { getFeatureFlags } from '../../utils/configuration';
import AdminUiConfig from './types/ServiceConfiguration';

const { enabled = false, enable_audit_logging = false } =
  (getFeatureFlags()?.features?.admin_ui as AdminUiConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const isAuditLoggingEnabled = () => {
  return enable_audit_logging;
};
