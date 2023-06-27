import esMX from './es-mx.json';
import ptBR from './pt-br.json';
import th from './th.json';
import zhHans from './zh-hans.json';

// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  RECORDING_PAUSED = 'PSRecordingPaused',
  RECORDING_PAUSED_LABEL = 'PSRecordingPausedLabel',
  RESUME_RECORDING = 'PSResumeRecording',
  PAUSE_FAILED = 'PSPauseRecordingFailed',
  RESUME_FAILED = 'PSResumeRecordingFailed',
  PAUSE_TOOLTIP = 'PSPauseRecordingTooltip',
  RESUME_TOOLTIP = 'PSResumeRecordingTooltip',
}

export const stringHook = () => ({
  'en-US': {
    [StringTemplates.RECORDING_PAUSED]:
      'Call recording has been paused. Please remember to resume call recording when appropriate.',
    [StringTemplates.RECORDING_PAUSED_LABEL]: 'Call Recording Paused',
    [StringTemplates.RESUME_RECORDING]: 'Resumed recording this call.',
    [StringTemplates.PAUSE_FAILED]: 'Failed to pause call recording. Please try again.',
    [StringTemplates.RESUME_FAILED]: 'Failed to resume call recording. Please try again.',
    [StringTemplates.PAUSE_TOOLTIP]: 'Pause Recording',
    [StringTemplates.RESUME_TOOLTIP]: 'Resume Recording',
  },
  'es-MX': esMX,
  'pt-BR': ptBR,
  th,
  'zh-Hans': zhHans,
});
