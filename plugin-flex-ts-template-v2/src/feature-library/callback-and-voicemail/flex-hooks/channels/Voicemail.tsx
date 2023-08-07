import * as Flex from '@twilio/flex-ui';
import React from 'react';
import VoicemailIcon from '@material-ui/icons/Voicemail';

import { TaskAttributes } from '../../../../types/task-router/Task';
import { StringTemplates } from '../strings/Callback';

export const channelHook = function createVoicemailChannel(flex: typeof Flex, manager: Flex.Manager) {
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

  const getTaskName = (task: Flex.ITask, queue: boolean): string => {
    if (queue) {
      return `${task.queueName}: ${(manager.strings as any)[StringTemplates.Voicemail]} (${task.attributes.name})`;
    }
    return `${(manager.strings as any)[StringTemplates.Voicemail]} (${task.attributes.name})`;
  };

  const { templates } = channelDefinition;
  const VoicemailChannel: Flex.TaskChannelDefinition = {
    ...channelDefinition,
    templates: {
      ...templates,
      TaskListItem: {
        ...templates?.TaskListItem,
        firstLine: (task: Flex.ITask) => getTaskName(task, true),
      },
      TaskCanvasHeader: {
        ...templates?.TaskCanvasHeader,
        title: (task: Flex.ITask) => getTaskName(task, true),
      },
      IncomingTaskCanvas: {
        ...templates?.IncomingTaskCanvas,
        firstLine: (task: Flex.ITask) => getTaskName(task, true),
      },
      TaskCard: {
        ...templates?.TaskCard,
        firstLine: (task: Flex.ITask) => getTaskName(task, false),
      },
      Supervisor: {
        ...templates?.Supervisor,
        TaskCanvasHeader: {
          ...templates?.Supervisor?.TaskCanvasHeader,
          title: (task: Flex.ITask) => getTaskName(task, false),
        },
        TaskOverviewCanvas: {
          ...templates?.Supervisor?.TaskOverviewCanvas,
          firstLine: (task: Flex.ITask) => getTaskName(task, true),
        },
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
