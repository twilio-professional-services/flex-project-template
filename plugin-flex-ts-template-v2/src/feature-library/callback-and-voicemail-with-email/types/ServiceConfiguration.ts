export default interface CallbackAndVoicemailWithEmailConfig {
  enabled: boolean;
  allow_requeue: boolean;
  max_attempts: number;
  auto_select_task: boolean;
  enable_email_notifications: boolean;
  admin_email: string;
  mailgun_domain: string;
  mailgun_api_key: string;
}
