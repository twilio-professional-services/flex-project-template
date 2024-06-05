import { FlexEvent } from '../../../../types/feature-loader';
import { isFeatureEnabled } from '../../config';
import { registerPauseCallRecordingAction } from '../custom-action/pauseRecording';
import { registerResumeCallRecordingAction } from '../custom-action/resumeRecording';
import { registerToggleCallRecordingAction } from '../custom-action/toggleRecording';

export const eventName = FlexEvent.pluginsInitialized;
export const eventHook = function () {
  if (!isFeatureEnabled()) return;

  registerPauseCallRecordingAction();
  registerResumeCallRecordingAction();
  registerToggleCallRecordingAction();
};
