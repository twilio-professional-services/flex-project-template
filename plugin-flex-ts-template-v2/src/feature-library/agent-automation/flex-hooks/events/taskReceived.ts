import * as Flex from '@twilio/flex-ui';
import { ITask } from '@twilio/flex-ui';
import { TaskQualificationConfig } from 'feature-library/agent-automation/types/ServiceConfiguration';

import { getMatchingTaskConfiguration } from '../../config';
import { FlexEvent } from '../../../../types/feature-loader';

async function selectAndAcceptTask(task: ITask, taskConfig: TaskQualificationConfig) {
  const {
    sid,
    attributes: { direction },
    taskChannelUniqueName,
  } = task;

  // we don't want to auto accept outbound voice tasks as they are already auto
  // accepted
  if (taskChannelUniqueName === 'voice' && direction === 'outbound') return;

  // Select and accept the task per configuration
  try {
    if (taskConfig.auto_select) await Flex.Actions.invokeAction('SelectTask', { sid });
  } catch (error) {
    console.error('[agent-automation] Unable to auto select task', error);
  }
  try {
    if (taskConfig.auto_accept) await Flex.Actions.invokeAction('AcceptTask', { sid });
  } catch (error) {
    console.error('[agent-automation] Unable to auto accept task', error);
  }
}

export const eventName = FlexEvent.taskReceived;
export const eventHook = function autoSelectAndAcceptTask(flex: typeof Flex, manager: Flex.Manager, task: ITask) {
  const taskConfig = getMatchingTaskConfiguration(task);
  if (taskConfig) selectAndAcceptTask(task, taskConfig);
};
