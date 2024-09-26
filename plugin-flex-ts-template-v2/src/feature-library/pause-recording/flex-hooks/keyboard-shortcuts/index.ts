import * as Flex from '@twilio/flex-ui';

import { StringTemplates } from '../strings/PauseRecording';

// Return an object of KeyboardShortcuts
export const keyboardShortcutHook = () => ({
  2: {
    action: toggleCallRecording,
    name: StringTemplates.SHORTCUT_TOGGLE_RECORDING,
    throttle: 1000,
  },
  3: {
    action: pauseCallRecording,
    name: StringTemplates.SHORTCUT_PAUSE_RECORDING,
    throttle: 1000,
  },
  4: {
    action: resumeCallRecording,
    name: StringTemplates.SHORTCUT_RESUME_RECORDING,
    throttle: 1000,
  },
});

const getCurrentTask = () => {
  // Get the state of the Flex store
  const state = Flex.Manager.getInstance().store.getState();

  // Find the currently focused task
  const focusedTaskSid = state.flex.view.selectedTaskSid;

  if (focusedTaskSid) {
    const task = Flex.TaskHelper.getTaskByTaskSid(focusedTaskSid);
    console.log(`Returning focused task`, task);
    return task;
  }

  console.log(`No focused task found, returning null`);
  return null;
};

const toggleCallRecording = () => {
  Flex.Actions.invokeAction('ToggleCallRecording', { task: getCurrentTask() });
};

const pauseCallRecording = () => {
  Flex.Actions.invokeAction('PauseCallRecording', { task: getCurrentTask() });
};

const resumeCallRecording = () => {
  Flex.Actions.invokeAction('ResumeCallRecording', { task: getCurrentTask() });
};
