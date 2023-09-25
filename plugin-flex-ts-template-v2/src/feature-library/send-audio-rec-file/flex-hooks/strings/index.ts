import esES from './es-es.json';
import esMX from './es-mx.json';
import ptBR from './pt-br.json';
import th from './th.json';
import zhHans from './zh-hans.json';

// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  AudioRecorder = 'PSAudioRecorder',
  RecordingMessage = 'PSRecordingMessage',
  StartRecButton = 'StartRecButton',
  StopRecButton = 'StopRecButton',
  RemoveRecButton = 'RemoveRecButton',
  MicBlockedMessage = 'MicBlockedMessage',
}

export const stringHook = () => ({
  'en-US': {
    [StringTemplates.AudioRecorder]: 'Audio Recorder',
    [StringTemplates.RecordingMessage]: 'Recording in progress ',
    [StringTemplates.StartRecButton]: 'Start Recording',
    [StringTemplates.StopRecButton]: 'Stop Recording',
    [StringTemplates.RemoveRecButton]: 'Discard Recording',
    [StringTemplates.MicBlockedMessage]: 'Allow this page to access your microphone before using this feature.',
  },
  'es-MX': esMX,
  'pt-BR': ptBR,
  th,
  'zh-Hans': zhHans,
  'es-ES': esES,
});
