import { Manager } from '@twilio/flex-ui';

import { ParticipantInviteType } from '../../../types/conversations/Participant';
import ConversationsService from '../../../utils/serverless/Conversations/ConversationsService';
import logger from '../../../utils/logger';

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
            logger.debug('[conversation-transfer] instantQuery', { key, value });
            const name = targetType === 'Worker' ? (value as any).attributes.full_name : (value as any).queue_name;
            resolve(name);
          });
        } else {
          logger.warn(`[conversation-transfer] Invite participant name instantQuery failed for ${targetSid}`);
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
    } catch (error: any) {
      logger.error(`[conversation-transfer] Error updating channel attributes for ${conversationSid}`, error);
    }
};
