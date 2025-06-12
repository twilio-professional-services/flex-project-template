import * as Flex from '@twilio/flex-ui';
import { isFeatureEnabled } from '../../config';

import { StringTemplates } from '../strings/PauseRecording';

interface KeyboardShortcut {
  key: string;
  description: string;
  callback: () => void;
  categories?: string[];
}

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

// Make sure keyboard shortcuts don't interfere with Ctrl+C
const registerKeyboardShortcuts = (flex: typeof Flex, manager: Flex.Manager) => {
  // Only register if the feature is enabled
  if (!isFeatureEnabled()) return;

  // Use a safer approach to register keyboard shortcuts
  const keyboardShortcuts: KeyboardShortcut[] = [
    {
      key: 'p',
      description: 'Pause/Resume call recording',
      callback: pauseCallRecording,
    },
    {
      key: 'r',
      description: 'Toggle call recording',
      callback: toggleCallRecording,
    },
  ];

  keyboardShortcuts.forEach((shortcut) => {
    // Check if KeyboardShortcuts exists before using it
    // Use any type to bypass TypeScript checking for the Flex API
    const flexAny = flex as any;
    if (flexAny.KeyboardShortcuts && typeof flexAny.KeyboardShortcuts.registerShortcut === 'function') {
      flexAny.KeyboardShortcuts.registerShortcut(
        shortcut.key,
        shortcut.description,
        shortcut.callback,
        shortcut.categories
      );
    } else {
      // Fallback for newer Flex versions that might have changed the API
      console.warn('KeyboardShortcuts API not available in this Flex version');
    }
  });
};
