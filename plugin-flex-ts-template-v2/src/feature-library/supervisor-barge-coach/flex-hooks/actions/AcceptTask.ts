import * as Flex from '@twilio/flex-ui';

import { FlexAction, FlexActionEvent } from '../../../../types/feature-loader';
import { reduxNamespace } from '../../../../utils/state';

export const actionName = FlexAction.AcceptTask;
export const actionEvent = FlexActionEvent.before;
export const actionHook = async function chatBargeCheckParticipant(flex: typeof Flex, manager: any) {
  // If we are already barged into a chat, we cannot accept the task. This could happen if the agent
  // attempts to transfer to the same supervisor that is barged.
  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload, abortFunction) => {
    const { task } = payload;

    if (!Flex.TaskHelper.isCBMTask(task)) {
      return;
    }

    const conversationSid = task.attributes.conversationSid || '';
    const { bargedConversations } = manager?.store?.getState()?.[reduxNamespace]?.supervisorBargeCoach;

    // Find the key associated with the conversationSidValue
    const matchingKey = Object.keys(bargedConversations).find((sid) => sid === conversationSid);

    // If found, remove the worker participant and delete the key/value pair from the object
    if (matchingKey) {
      // TODO: Show notification!
      abortFunction();
      // TODO: Make this a button on the notification
      await Flex.Actions.invokeAction('SelectTaskInSupervisor', { sid: matchingKey });
    }
  });
};
