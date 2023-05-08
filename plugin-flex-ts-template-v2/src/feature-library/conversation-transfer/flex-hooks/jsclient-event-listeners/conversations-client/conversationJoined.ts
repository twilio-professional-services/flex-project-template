import * as Flex from '@twilio/flex-ui';
import { Conversation } from '@twilio/conversations';

import { FlexJsClient, ConversationEvent } from '../../../../../types/feature-loader';
import { removeInvitedParticipant } from '../../../helpers/inviteTracker';

export const clientName = FlexJsClient.conversationsClient;
export const eventName = ConversationEvent.conversationJoined;
export const jsClientHook = async function removeInviteOnJoin(
  _flex: typeof Flex,
  _manager: Flex.Manager,
  conversation: Conversation,
) {
  const task = Flex.TaskHelper.getTaskFromConversationSid(conversation.sid);

  if (!task || !Flex.TaskHelper.isCBMTask(task)) {
    // only handle if this is CBM
    return;
  }

  const currentAttributes = conversation.attributes;
  const { invites = {} } = (currentAttributes as any) || {};

  if (invites[task.taskSid]) {
    await removeInvitedParticipant(conversation.sid, conversation.attributes as object, task.taskSid);
  }
};
