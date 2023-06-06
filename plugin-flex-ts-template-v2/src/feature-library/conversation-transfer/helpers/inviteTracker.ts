import { Manager, ConversationState } from '@twilio/flex-ui';

import { InvitedParticipants } from '../types/InvitedParticipantDetails';
import { ParticipantInviteType } from '../types/ParticipantInvite';
import ConversationsService from '../../../utils/serverless/Conversations/ConversationsService';

const syncClient = Manager.getInstance()?.insightsClient;

const instantQuery = async (targetSid: string, targetType: ParticipantInviteType) => {
  return new Promise<string>((resolve, _reject) => {
    const index = targetType === 'Worker' ? 'tr-worker' : 'tr-queue';

    syncClient.instantQuery(index).then((q) => {
      const search = targetType === 'Worker' ? `data.worker_sid eq "${targetSid}"` : `data.queue_sid eq "${targetSid}"`;

      q.search(search);

      q.on('searchResult', (items) => {
        if (items && Object.keys(items).length > 0) {
          Object.entries(items).forEach(([key, value]) => {
            console.log('instantQuery', key, value);
            const name = targetType === 'Worker' ? (value as any).attributes.full_name : (value as any).queue_name;
            resolve(name);
          });
        } else {
          console.log('Invite participant name instantQuery failed for ', targetSid);
          resolve(targetSid);
        }
      });
    });
  });
};

export const getWorkerName = async (sid: string): Promise<string> => {
  return instantQuery(sid, 'Worker');
};

// This is to handle removing any invite by task sid for a channel
export const removeInvitedParticipant = async (conversationSid: string, currentAttributes: object, taskSid: string) => {
  const { invites = {} } = (currentAttributes as any) || {};

  const updatedInvites = JSON.parse(JSON.stringify(invites));
  delete updatedInvites[taskSid];

  const updatedAttributes = {
    ...currentAttributes,
    invites: updatedInvites,
  };

  if (conversationSid)
    try {
      await ConversationsService.updateChannelAttributes(conversationSid, updatedAttributes);
    } catch (error) {
      console.log('Error', error, conversationSid);
    }
};

export const countOfOutstandingInvitesForConversation = (conversation: ConversationState.ConversationState): number => {
  const { invites = undefined } = (conversation?.source?.attributes as any as InvitedParticipants) || {};
  return Object.keys(invites || {}).length;
};
