import { ITask, StateHelper, Manager, ConversationState } from '@twilio/flex-ui';

import { InvitedParticipantDetails, InvitedParticipants } from '../types/InvitedParticipantDetails';
import { ParticipantInviteType } from '../types/ParticipantInvite';
import ProgrammableChatService from '../../../utils/serverless/ProgrammableChat/ProgrammableChatService';

const syncClient = Manager.getInstance()?.insightsClient;

const instantQuery = async (targetSid: string, targetType: ParticipantInviteType) => {
  return new Promise<string>((resolve, _reject) => {
    const index = targetType === 'Worker' ? 'tr-worker' : 'tr-queue';

    syncClient.instantQuery(index).then((q) => {
      const search = targetType === 'Worker' ? `data.worker_sid eq "${targetSid}"` : `data.queue_sid eq "${targetSid}"`;

      q.search(search);

      q.on('searchResult', (items) => {
        if (items) {
          Object.entries(items).forEach(([key, value]) => {
            console.log('instantQuery', key, value);
            const name = targetType === 'Worker' ? (value as any).attributes.full_name : (value as any).queue_name;
            resolve(name);
          });
        } else {
          console.log('Invite participant name instantQuery failed for ', targetSid);
        }
      });
    });
  });
};

const getWorkerName = async (sid: string): Promise<string> => {
  return instantQuery(sid, 'Worker');
};

const getQueueName = async (sid: string): Promise<string> => {
  return instantQuery(sid, 'Queue');
};

export const addInviteToConversation = async (task: ITask, invitesTaskSid: string, targetSid: string) => {
  const inviteTargetType = targetSid.startsWith('WK') ? 'Worker' : 'Queue';
  const targetName = await (targetSid.startsWith('WK') ? getWorkerName(targetSid) : getQueueName(targetSid));

  console.log('addInviteToConversation', targetName);
  const invite: InvitedParticipantDetails = {
    invitesTaskSid,
    targetSid,
    timestampCreated: new Date(),
    targetName,
    inviteTargetType,
  };

  const conversationState = StateHelper.getConversationStateForTask(task);
  if (!conversationState?.source) return;

  const conversation = conversationState?.source;
  const currentAttributes = conversation.attributes as object;
  const updatedAttributes = {
    ...currentAttributes,
    invites: {
      ...(currentAttributes as InvitedParticipants)?.invites,
      [invitesTaskSid]: invite,
    },
  };

  if (conversation.sid)
    try {
      await ProgrammableChatService.updateChannelAttributes(conversation.sid, updatedAttributes);
    } catch (error) {
      console.log('Error', error, conversation);
    }
};

// This is to handle removing any invite by task sid for a channel
export const removeInvitedParticipant = async (conversation: ConversationState.ConversationState, taskSid: string) => {
  const currentAttributes = conversation?.source?.attributes as object;

  const { invites = {} } = (currentAttributes as any) || {};

  const updatedInvites = JSON.parse(JSON.stringify(invites));
  delete updatedInvites[taskSid];

  const updatedAttributes = {
    ...currentAttributes,
    invites: updatedInvites,
  };

  if (conversation?.source?.sid)
    try {
      await ProgrammableChatService.updateChannelAttributes(conversation?.source?.sid, updatedAttributes);
    } catch (error) {
      console.log('Error', error, conversation);
    }
};

// This is to handle removing an invite afer WE join the channel
export const checkAndRemoveOldInvitedParticipants = async (
  task: ITask,
  conversation: ConversationState.ConversationState,
) => {
  const currentAttributes = conversation?.source?.attributes;
  const { invites = {} } = (currentAttributes as any) || {};

  if (invites[task.taskSid]) {
    await removeInvitedParticipant(conversation, task.taskSid);
  }
};

export const countOfOutstandingInvitesForConversation = (conversation: ConversationState.ConversationState): number => {
  const { invites = undefined } = (conversation?.source?.attributes as any as InvitedParticipants) || {};
  return Object.keys(invites || {}).length;
};
