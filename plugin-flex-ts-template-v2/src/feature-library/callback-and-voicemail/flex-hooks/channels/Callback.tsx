import * as Flex from '@twilio/flex-ui';
import React from 'react';
import { TaskAttributes } from '../../../../types/task-router/Task';
import PhoneCallbackIcon from '@material-ui/icons/PhoneCallback';
import { isFeatureEnabled } from '../..';

export function createCallbackChannel(flex: typeof Flex, manager: Flex.Manager) {

  if(!isFeatureEnabled()) return;

  const channelDefinition = flex.DefaultTaskChannels.createDefaultTaskChannel(
    'callback',
    (task) => {
      const { taskType } = task.attributes as TaskAttributes;
      return task.taskChannelUniqueName === 'voice' && taskType === 'callback';
    },
    'CallbackIcon',
    'CallbackIcon',
    'palegreen',
  );

  const { templates } = channelDefinition;
  const CallbackChannel: Flex.TaskChannelDefinition = {
    ...channelDefinition,
    templates: {
      ...templates,
      TaskListItem: {
        ...templates?.TaskListItem,
        firstLine: (task: Flex.ITask) => `${task.queueName}: ${task.attributes.name}`
      },
      TaskCanvasHeader: {
        ...templates?.TaskCanvasHeader,
        title: (task: Flex.ITask) => `${task.queueName}: ${task.attributes.name}`
      },
      IncomingTaskCanvas: {
        ...templates?.IncomingTaskCanvas,
        firstLine: (task: Flex.ITask) => task.queueName
      }
    },
    icons: {
      active: <PhoneCallbackIcon key="active-callback-icon" />,
      list: <PhoneCallbackIcon key="list-callback-icon" />,
      main: <PhoneCallbackIcon key="main-callback-icon" />,
    }
  }

  // Register Channel
  //CallbackChannel.capabilities.add(Flex.TaskChannelCapability.Wrapup);
  flex.TaskChannels.register(CallbackChannel);
}
