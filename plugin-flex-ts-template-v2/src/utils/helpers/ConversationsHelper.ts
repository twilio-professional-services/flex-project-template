import * as Flex from '@twilio/flex-ui';

import { InvitedParticipants } from '../../types/conversations/Participant';

class ConversationsHelper {
  countOfOutstandingInvitesForConversation = (conversation: Flex.ConversationState.ConversationState): number => {
    const { invites = undefined } = (conversation?.source?.attributes as any as InvitedParticipants) || {};
    return Object.keys(invites || {}).length;
  };
}
const ConversationsHelperSingleton = new ConversationsHelper();
export default ConversationsHelperSingleton;
