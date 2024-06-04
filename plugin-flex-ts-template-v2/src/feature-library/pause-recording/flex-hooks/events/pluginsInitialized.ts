import * as Flex from '@twilio/flex-ui';
import { Actions } from '@twilio/flex-ui';

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

  const getCurrentTask = () => {
    const manager = Flex.Manager.getInstance();

    // Get the state of the Flex store
    const state = manager.store.getState();

    // Find the currently focused task
    const focusedTaskSid = state.flex.view.selectedTaskSid;

    if (focusedTaskSid) {
      const task = Flex.TaskHelper.getTaskByTaskSid(focusedTaskSid);
      console.log(`Returning focused task`, task);
      return task;
    }

    console.log(`No task found, returning null`);
    return null;
  };

  const toggleCallRecording = () => {
    Actions.invokeAction('ToggleCallRecording', { task: getCurrentTask() });
  };

  const pauseCallRecording = () => {
    Actions.invokeAction('PauseCallRecording', { task: getCurrentTask() });
  };

  const resumeCallRecording = () => {
    Actions.invokeAction('ResumeCallRecording', { task: getCurrentTask() });
  };

  Flex.KeyboardShortcutManager.addShortcuts({
    2: { action: toggleCallRecording, name: 'Toggle call recording pause/resume', throttle: 1000 },
    3: { action: pauseCallRecording, name: 'Pause call recording', throttle: 1000 },
    4: { action: resumeCallRecording, name: 'Resume call recording', throttle: 1000 },
  });
};
