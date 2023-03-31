import * as Flex from '@twilio/flex-ui';
import React from 'react';
import PhoneCallbackIcon from '@material-ui/icons/PhoneCallback';

import { TaskAttributes } from '../../../../types/task-router/Task';

export const channelHook = function createCallbackChannel(flex: typeof Flex, _manager: Flex.Manager) {
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
        firstLine: (task: Flex.ITask) => `${task.queueName}: ${task.attributes.name}`,
      },
      TaskCanvasHeader: {
        ...templates?.TaskCanvasHeader,
        title: (task: Flex.ITask) => `${task.queueName}: ${task.attributes.name}`,
      },
      IncomingTaskCanvas: {
        ...templates?.IncomingTaskCanvas,
        firstLine: (task: Flex.ITask) => task.queueName,
      },
    },
    icons: {
      active: <PhoneCallbackIcon key="active-callback-icon" />,
      list: <PhoneCallbackIcon key="list-callback-icon" />,
      main: <PhoneCallbackIcon key="main-callback-icon" />,
    },
  };

  // Register Channel
  return CallbackChannel;
};
