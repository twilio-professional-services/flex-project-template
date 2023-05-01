import * as Flex from '@twilio/flex-ui';

import { FlexEvent } from '../../types/feature-loader';

const taskEvents = [
  FlexEvent.taskAccepted,
  FlexEvent.taskCanceled,
  FlexEvent.taskCompleted,
  FlexEvent.taskReceived,
  FlexEvent.taskRejected,
  FlexEvent.taskRescinded,
  FlexEvent.taskTimeout,
  FlexEvent.taskUpdated,
  FlexEvent.taskWrapup,
];

const isTaskEvent = (event: FlexEvent): boolean => {
  return taskEvents.includes(event);
};

export const addHook = (flex: typeof Flex, manager: Flex.Manager, feature: string, hook: any) => {
  if (!hook.eventName) {
    console.info(`Feature ${feature} declared event hook, but is missing eventName to hook`);
    return;
  }
  const event = hook.eventName as FlexEvent;

  console.info(
    `Feature ${feature} registered %c${event} %cevent hook: %c${hook.eventHook.name}`,
    'font-weight:bold',
    'font-weight:normal',
    'font-weight:bold',
  );

  if (event === FlexEvent.pluginsInitialized) {
    manager.events.addListener(event, () => {
      hook.eventHook(flex, manager);
    });
  } else if (event === FlexEvent.tokenUpdated) {
    manager.events.addListener(event, (tokenPayload) => {
      hook.eventHook(flex, manager, tokenPayload);
    });
  } else if (isTaskEvent(event)) {
    manager.events.addListener(event, (task) => {
      hook.eventHook(flex, manager, task);
    });
  }
};
