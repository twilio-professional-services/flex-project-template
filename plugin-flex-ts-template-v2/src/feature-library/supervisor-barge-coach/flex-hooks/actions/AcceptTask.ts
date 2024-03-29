import * as Flex from '@twilio/flex-ui';

import { isFeatureEnabled } from '../../config';
import { FlexAction, FlexActionEvent } from '../../../../types/feature-loader';
import BargeCoachService from '../../utils/serverless/BargeCoachService';
import { reduxNamespace } from '../../../../utils/state';
import { Actions as BargeCoachStatusAction } from '../states/SupervisorBargeCoach';

export const actionName = FlexAction.AcceptTask;
export const actionEvent = FlexActionEvent.before;
export const actionHook = async function chatBargeCheckParticipant(flex: typeof Flex, manager: any) {
  if (!isFeatureEnabled()) return;
  // Listen in before AcceptTask, this is related to chatBarge, this would be if the agent wishes to transfer
  // either cold or warm to the supervisor that is already barged / joined the conversation.  This will remove them
  // and allow the task to properly add them to the conversation as a Flex Interactions Participant
  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload) => {
    const { task } = payload;
    const conversationSid = task.attributes.conversationSid || '';
    const chatBarge = manager?.store?.getState()?.[reduxNamespace]?.supervisorBargeCoach.chatBarge;
    console.log('chatBargeConveration', chatBarge);

    // Find the key associated with the conversationSidValue
    const matchingKey = Object.keys(chatBarge).find((key) => chatBarge[key] === conversationSid);

    // If found, remove the worker participant and delete the key/value pair from the object
    if (matchingKey) {
      const myWorkerName = manager.store.getState().flex?.session?.identity || '';
      await BargeCoachService.removeWorkerParticipant(conversationSid, myWorkerName);
      // Remove key/value pair from the object
      delete chatBarge[matchingKey];
      manager.store.dispatch(BargeCoachStatusAction.setBargeCoachStatus({ chatBarge }));
      // Storing chatBarge to browser cache to help if a refresh happens
      // will use this in the browserRefreshHelper
      localStorage.setItem('chatBarge', JSON.stringify(chatBarge));
    }
  });
};
