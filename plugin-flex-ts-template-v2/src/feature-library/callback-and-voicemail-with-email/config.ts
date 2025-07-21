import { getFeatureFlags } from '../../utils/configuration';
import CallbackAndVoicemailWithEmailConfig from './types/ServiceConfiguration';

const {
  enabled = false,
  allow_requeue = false,
  max_attempts = 1,
  auto_select_task = false,
  enable_email_notifications = true,
  admin_email = '',
  mailgun_domain = '',
  mailgun_api_key = '',
} = (getFeatureFlags()?.features?.callback_and_voicemail_with_email as CallbackAndVoicemailWithEmailConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const isAllowRequeueEnabled = () => {
  return enabled && allow_requeue;
};

export const isAutoSelectTaskEnabled = () => {
  return enabled && auto_select_task;
};

export const getMaxAttempts = () => {
  return max_attempts;
};

export const isEmailNotificationsEnabled = () => {
  return enabled && enable_email_notifications;
};

export const getAdminEmail = () => {
  return admin_email;
};

export const getMailgunDomain = () => {
  return mailgun_domain;
};

export const getMailgunApiKey = () => {
  return mailgun_api_key;
};
