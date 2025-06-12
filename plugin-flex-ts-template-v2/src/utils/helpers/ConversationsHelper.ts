import * as Flex from '@twilio/flex-ui';

import { InvitedParticipants } from '../../types/conversations/Participant';

class ConversationsHelper {
  countOfOutstandingInvitesForConversation = (conversation: Flex.ConversationState.ConversationState): number => {
    const { invites = undefined } = (conversation?.source?.attributes as any as InvitedParticipants) || {};
    return Object.keys(invites || {}).length;
  };

  getMyParticipant = async (task: Flex.ITask): Promise<any> => {
    const { conversationSid } = task.attributes;
    
    if (!conversationSid) {
      return null;
    }
    
    const client = Flex.Manager.getInstance().conversationsClient;
    if (!client) {
      return null;
    }
    
    try {
      const conversation = await client.getConversationBySid(conversationSid);
      const participants = await conversation.getParticipants();
      const myIdentity = Flex.Manager.getInstance().user.identity;
      
      return participants.find(p => p.identity === myIdentity);
    } catch (error) {
      console.error('Error getting participant:', error);
      return null;
    }
  };
}

export default ConversationsHelper;
