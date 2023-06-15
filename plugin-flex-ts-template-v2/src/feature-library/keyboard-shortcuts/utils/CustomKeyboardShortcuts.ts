import { Actions, Manager } from '@twilio/flex-ui';

import { StringTemplates } from '../flex-hooks/strings';

const manager = Manager.getInstance();

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
  console.log(
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
