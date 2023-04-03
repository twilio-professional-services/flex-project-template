import * as Flex from '@twilio/flex-ui';

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
    Flex.Manager.getInstance().workerClient?.attributes
  );
};

export const presetCustomShortcuts = {
  D: { action: toggleDialpad, name: 'Toggle dialpad', throttle: 100 },
  Q: { action: toggleSidebar, name: 'Toggle sidebar', throttle: 100 },
  K: { action: navigateToTasks, name: 'Navigate to tasks', throttle: 100 },
  9: {
    action: debuggingHelper,
    name: 'Debugging assistance',
    throttle: 3000,
  },
  L: {
    action: navigateToKeyboardShortcuts,
    name: 'Navigate to keyboard shortcuts',
    throttle: 100,
  },
  I: {
    action: navigateToTeamsView,
    name: 'Navigate to Teams View',
    throttle: 100,
  },
  O: {
    action: navigateToQueuesView,
    name: 'Navigate to Real-time Queues View',
    throttle: 100,
  },
};
