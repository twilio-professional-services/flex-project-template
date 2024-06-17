import * as Flex from '@twilio/flex-ui';
import { Actions, Manager } from '@twilio/flex-ui';

import { StringTemplates } from '../flex-hooks/strings';
import logger from '../../../utils/logger';

const manager = Manager.getInstance();

const getCurrentTask = () => {
  // Get the state of the Flex store
  const state = manager.store.getState();

  // Find the currently focused task
  const focusedTaskSid = state.flex.view.selectedTaskSid;

  if (focusedTaskSid) {
    const task = Flex.TaskHelper.getTaskByTaskSid(focusedTaskSid);
    logger.debug(`[keyboard-shortcuts] Returning focused task`, task);
    return task;
  }

  logger.warn(`[keyboard-shortcuts] No focused task found, returning null`);
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

const toggleDialpad = () => {
  Actions.invokeAction('ToggleOutboundDialer');
};

const toggleSidebar = () => {
  Actions.invokeAction('ToggleSidebar');
};

const navigateToTasks = () => {
  Actions.invokeAction('NavigateToView', {
    viewName: 'agent-desktop',
  });
};

const navigateToKeyboardShortcuts = () => {
  Actions.invokeAction('NavigateToView', {
    viewName: 'keyboard-shortcuts',
  });
};

const navigateToTeamsView = () => {
  Actions.invokeAction('NavigateToView', {
    viewName: 'teams',
  });
};

const navigateToQueuesView = () => {
  Actions.invokeAction('NavigateToView', {
    viewName: 'queues-stats',
  });
};

const debuggingHelper = () => {
  logger.info(
    `This information is for debugging purposes only:
    accountSid: ${Manager.getInstance().workerClient?.accountSid}
    workerSid: ${Manager.getInstance().workerClient?.sid}
    workspaceSid: ${Manager.getInstance().workerClient?.workspaceSid}
    friendlyName: ${Manager.getInstance().workerClient?.friendlyName}
    attributes:`,
    Manager.getInstance().workerClient?.attributes,
  );
};

export const presetCustomShortcuts = () => {
  return {
    2: {
      action: toggleCallRecording,
      name: (manager.strings as any)[StringTemplates.CustomShortcutToggleCallRecording],
      throttle: 1000,
    },
    3: {
      action: pauseCallRecording,
      name: (manager.strings as any)[StringTemplates.CustomShortcutPauseCallRecording],
      throttle: 1000,
    },
    4: {
      action: resumeCallRecording,
      name: (manager.strings as any)[StringTemplates.CustomShortcutResumeCallRecording],
      throttle: 1000,
    },
    D: {
      action: toggleDialpad,
      name: (manager.strings as any)[StringTemplates.CustomShortcutToggleDialpad],
      throttle: 100,
    },
    Q: {
      action: toggleSidebar,
      name: (manager.strings as any)[StringTemplates.CustomShortcutToggleSidebar],
      throttle: 100,
    },
    K: {
      action: navigateToTasks,
      name: (manager.strings as any)[StringTemplates.CustomShortcutNavToTask],
      throttle: 100,
    },
    9: {
      action: debuggingHelper,
      name: (manager.strings as any)[StringTemplates.CustomShortcutDebugAssist],
      throttle: 3000,
    },
    L: {
      action: navigateToKeyboardShortcuts,
      name: (manager.strings as any)[StringTemplates.CustomShortcutNavigateToKeyboardShortcuts],
      throttle: 100,
    },
    I: {
      action: navigateToTeamsView,
      name: (manager.strings as any)[StringTemplates.CustomShortcutNavigateToTeamsView],
      throttle: 100,
    },
    O: {
      action: navigateToQueuesView,
      name: (manager.strings as any)[StringTemplates.CustomShortcutNavigateToQueuesView],
      throttle: 100,
    },
  };
};
