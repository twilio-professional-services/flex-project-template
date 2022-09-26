export default interface CallbackAndVoicemailConfig {
  enabled: boolean;
  allow_requeue: boolean;
  max_attempts: number;
  auto_select_task: boolean;
}
