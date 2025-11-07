import * as Flex from '@twilio/flex-ui';

import { FlexEvent } from '../../../../types/feature-loader';
import { isInternalCall } from '../../helpers/internalCall';

export const eventName = FlexEvent.taskReceived;
export const eventHook = async function exampleTaskReceivedHandler(
  flex: typeof Flex,
  manager: Flex.Manager,
  task: Flex.ITask,
) {
  if (!isInternalCall(task) || task.incomingTransferObject) {
    return;
  }

  await flex.Actions.invokeAction('AcceptTask', { task });
  flex.Actions.invokeAction('SelectTask', { task });
};
