// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  RECORDING_PAUSED = 'PSRecordingPaused',
  RESUME_RECORDING = 'PSResumeRecording',
  PAUSE_FAILED = 'PSPauseFailed',
  RESUME_FAILED = 'PSResumeFailed',
}

export default {
  [StringTemplates.RECORDING_PAUSED]: 'Call recording has been paused. Please remember to resume call recording when appropriate.',
  [StringTemplates.RESUME_RECORDING]: 'Resumed recording this call.',
  [StringTemplates.PAUSE_FAILED]: 'Failed to pause call recording. Please try again.',
  [StringTemplates.RESUME_FAILED]: 'Failed to resume call recording. Please try again.',
};