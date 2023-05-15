import * as Flex from '@twilio/flex-ui';
import React from 'react';
import VoicemailIcon from '@material-ui/icons/Voicemail';

import { TaskAttributes } from '../../../../types/task-router/Task';

export const channelHook = function createVoicemailChannel(flex: typeof Flex, _manager: Flex.Manager) {
  const channelDefinition = flex.DefaultTaskChannels.createDefaultTaskChannel(
    'voicemail',
    (task) => {
      const { taskType } = task.attributes as TaskAttributes;
      return task.taskChannelUniqueName === 'voice' && taskType === 'voicemail';
    },
    'VoicemailIcon',
    'VoicemailIcon',
    'deepskyblue',
  );

  const { templates } = channelDefinition;
  const VoicemailChannel: Flex.TaskChannelDefinition = {
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
      active: <VoicemailIcon key="active-voicemail-icon" />,
      list: <VoicemailIcon key="list-voicemail-icon" />,
      main: <VoicemailIcon key="main-voicemail-icon" />,
    },
  };

  // Register Channel
  return VoicemailChannel;
};
