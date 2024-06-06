import * as Flex from '@twilio/flex-ui';

import { StringTemplates } from '../strings';

// Return an object of KeyboardShortcuts
export const keyboardShortcutHook = () => ({
  D: {
    action: toggleDialpad,
    name: StringTemplates.CustomShortcutToggleDialpad,
    throttle: 100,
  },
  Q: {
    action: toggleSidebar,
    name: StringTemplates.CustomShortcutToggleSidebar,
    throttle: 100,
  },
  K: {
    action: navigateToTasks,
    name: StringTemplates.CustomShortcutNavToTask,
    throttle: 100,
  },
  9: {
    action: debuggingHelper,
    name: StringTemplates.CustomShortcutDebugAssist,
    throttle: 3000,
  },
  P: {
    action: navigateToKeyboardShortcuts,
    name: StringTemplates.CustomShortcutNavigateToKeyboardShortcuts,
    throttle: 100,
  },
  I: {
    action: navigateToTeamsView,
    name: StringTemplates.CustomShortcutNavigateToTeamsView,
    throttle: 100,
  },
  O: {
    action: navigateToQueuesView,
    name: StringTemplates.CustomShortcutNavigateToQueuesView,
    throttle: 100,
  },
});

const toggleDialpad = () => {
  Flex.Actions.invokeAction('ToggleOutboundDialer');
};

const toggleSidebar = () => {
  Flex.Actions.invokeAction('ToggleSidebar');
};

const navigateToTasks = () => {
  Flex.Actions.invokeAction('NavigateToView', {
    viewName: 'agent-desktop',
  });
};

const navigateToKeyboardShortcuts = () => {
  Flex.Actions.invokeAction('NavigateToView', {
    viewName: 'keyboard-shortcuts',
  });
};

const navigateToTeamsView = () => {
  Flex.Actions.invokeAction('NavigateToView', {
    viewName: 'teams',
  });
};

const navigateToQueuesView = () => {
  Flex.Actions.invokeAction('NavigateToView', {
    viewName: 'queues-stats',
  });
};

const debuggingHelper = () => {
  console.log(
    `This information is for debugging purposes only:
    accountSid: ${Flex.Manager.getInstance().workerClient?.accountSid}
    workerSid: ${Flex.Manager.getInstance().workerClient?.sid}
    workspaceSid: ${Flex.Manager.getInstance().workerClient?.workspaceSid}
    friendlyName: ${Flex.Manager.getInstance().workerClient?.friendlyName}
    attributes:`,
    Flex.Manager.getInstance().workerClient?.attributes,
  );
};
