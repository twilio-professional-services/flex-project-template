export default interface RecordingStatusCallbackConfig {
  enabled: boolean;
  callback_url: string;
  notify_absent: boolean;
  notify_completed: boolean;
  notify_inprogress: boolean;
}
