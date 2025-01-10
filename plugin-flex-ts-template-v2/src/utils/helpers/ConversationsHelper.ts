import * as Flex from '@twilio/flex-ui';

import { InvitedParticipants } from '../../types/conversations/Participant';

class ConversationsHelper {
  countOfOutstandingInvitesForConversation = (conversation: Flex.ConversationState.ConversationState): number => {
    const { invites = undefined } = (conversation?.source?.attributes as any as InvitedParticipants) || {};
    return Object.keys(invites || {}).length;
  };

  allowLeave = (task: Flex.ITask) => {
    // more than two participants or are there any active invites?
    const conversationState = Flex.StateHelper.getConversationStateForTask(task);
    let numBoundParticipants = 0;
    if (conversationState?.participants) {
      // Gather the count of participants that have a binding. These participants are not internal.
      // Therefore, we will use subtraction to consider only one bound participant as part of the total count.
      conversationState.participants.forEach((participant) => {
        if (!participant.source?.bindings) {
          return;
        }
        for (const binding of Object.values(participant.source.bindings)) {
          if (binding) {
            numBoundParticipants += 1;
            break;
          }
        }
      });
    }
    if (
      conversationState &&
      (conversationState.participants.size - (numBoundParticipants > 1 ? numBoundParticipants - 1 : 0) > 2 ||
        this.countOfOutstandingInvitesForConversation(conversationState))
    ) {
      return true;
    }
    return false;
  };

  getMyParticipant = async (task: Flex.ITask): Promise<any> => {
    if (!task || !task.attributes?.flexInteractionChannelSid || !task?.workerSid) return null;
    const participants = await task.getParticipants(task.attributes.flexInteractionChannelSid);
    return participants.find((p: any) => p.type === 'agent' && task.workerSid === p.routingProperties?.workerSid);
  };
}
const ConversationsHelperSingleton = new ConversationsHelper();
export default ConversationsHelperSingleton;
