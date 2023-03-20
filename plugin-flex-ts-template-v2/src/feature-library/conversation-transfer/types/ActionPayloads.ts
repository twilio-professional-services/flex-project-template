import { ITask, ConversationState } from '@twilio/flex-ui';

export interface TransferOptions {
  attributes?: string;
  mode: string;
  priority?: string;
}

export interface TransferActionPayload {
  task: ITask;
  sid?: string; // taskSid or task is required
  targetSid: string; // target of worker or queue sid
  options?: TransferOptions;
}

export interface CancelChatParticipantInviteActionPayload {
  conversation: ConversationState.ConversationState;
  invitesTaskSid: string;
}

export interface LeaveChatActionPayload {
  conversation: ConversationState.ConversationState;
}

export interface RemoveChatParticipantActionPayload {
  task: ITask;
  interactionParticipantSid: string;
}
