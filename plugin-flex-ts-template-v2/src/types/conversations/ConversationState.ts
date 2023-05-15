import { Paginator } from 'twilio-chat/lib/interfaces/paginator';
import { Conversation, Message, Participant } from '@twilio/conversations';

interface ParticipantState {
  readonly source: Participant;
  readonly friendlyName: string;
  readonly online: boolean;
}
type ParticipantType = Map<string, ParticipantState>;

interface MessageState {
  readonly isFromMe: boolean;
  readonly groupWithNext: boolean;
  readonly groupWithPrevious: boolean;
  readonly index: number;
  readonly authorName?: string;
  readonly isSending?: boolean;
  readonly error?: boolean;
  readonly bodyAttachment?: string;
}

export default interface ConversationState {
  readonly currentPaginator?: Paginator<Message>;
  readonly isLoadingMessages: boolean;
  readonly isLoadingParticipants: boolean;
  readonly lastReadMessageIndex: number;
  readonly lastReadMessageByCurrentUserIndex: number;
  readonly participants: ParticipantType;
  readonly unreadMessages: MessageState[];
  readonly messages: MessageState[];
  readonly pendingMessages: MessageState[];
  readonly source?: Conversation;
  readonly typers: ParticipantState[];
  readonly isLoadingConversation: boolean;
  readonly errorWhileLoadingConversation: boolean;
  readonly showScrollDownBtn: boolean;
  readonly lastScrollPosition: number;
}
