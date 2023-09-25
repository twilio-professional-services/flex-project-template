import * as Flex from '@twilio/flex-ui';

import { FlexEvent } from '../../types/feature-loader';
import Activity from '../../types/task-router/Activity';
import logger from '../logger';

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
    logger.debug(`Feature ${feature} declared event hook, but is missing eventName to hook`);
    return;
  }
  const event = hook.eventName as FlexEvent;

  logger.debug(`Feature ${feature} registered ${event} event hook: ${hook.eventHook.name}`);

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
  } else if (event === FlexEvent.workerActivityUpdated) {
    manager.events.addListener(event, (activity: Activity, allActivities: Map<string, Activity>) => {
      hook.eventHook(flex, manager, activity, allActivities);
    });
  } else if (event === FlexEvent.workerAttributesUpdated) {
    manager.events.addListener(event, (newAttributes: Record<string, any>) => {
      hook.eventHook(flex, manager, newAttributes);
    });
  }
};
