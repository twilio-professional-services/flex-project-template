import esES from './es-es.json';
import esMX from './es-mx.json';
import ptBR from './pt-br.json';
import th from './th.json';
import zhHans from './zh-hans.json';

// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  ChatTransferTaskSuccess = 'ChatTransferTaskSuccess',
  ChatTransferFailedGeneric = 'ChatTransferFailedGeneric',
  ChatTransferFailedConsultNotSupported = 'ChatTransferFailedConsultNotSupported',
  ChatTransferFailedColdNotSupported = 'ChatTransferFailedColdNotSupported',
  ChatTransferFailedAlreadyParticipating = 'ChatTransferFailedAlreadyParticipating',
  ChatParticipantInvited = 'ChatParticipantInvited',
  ChatRemoveParticipantFailed = 'ChatRemoveParticipantFailed',
  ChatRemoveParticipantSuccess = 'ChatRemoveParticipantSuccess',
  ChatCancelParticipantInviteFailed = 'ChatCancelParticipantInviteFailed',
  ChatCancelParticipantInviteSuccess = 'ChatCancelParticipantInviteSuccess',
  ChatParticipantInviteOutstanding = 'ChatParticipantInviteOutstanding',
  TransferChat = 'PSConvTransferTransferChat',
  Participants = 'PSConvTransferParticipants',
  Agent = 'PSConvTransferAgent',
  Customer = 'PSConvTransferCustomer',
  Queue = 'PSConvTransferQueue',
  Remove = 'PSConvTransferRemove',
  InvitedParticipants = 'PSConvTransferInvitedParticipants',
  CancelInvite = 'PSConvTransferCancelInvite',
  LeaveChat = 'PSConvTransferLeaveChat',
}

export const stringHook = () => ({
  'en-US': {
    [StringTemplates.ChatTransferTaskSuccess]: 'Conversation transferred',
    [StringTemplates.ChatParticipantInvited]: 'Participant invited',
    [StringTemplates.ChatTransferFailedGeneric]: 'Error occured adding new participant',
    [StringTemplates.ChatTransferFailedConsultNotSupported]: 'Consult/warm transfer is not enabled',
    [StringTemplates.ChatTransferFailedColdNotSupported]: 'Cold transfer is not enabled',
    [StringTemplates.ChatTransferFailedAlreadyParticipating]:
      'The selected target is already a participant in the conversation',
    [StringTemplates.ChatRemoveParticipantFailed]: 'Participant remove failed',
    [StringTemplates.ChatRemoveParticipantSuccess]: 'Participant removed',
    [StringTemplates.ChatCancelParticipantInviteFailed]: 'Participant invite cancel failed',
    [StringTemplates.ChatCancelParticipantInviteSuccess]: 'Participant invite canceled',
    [StringTemplates.ChatParticipantInviteOutstanding]:
      'Inviting participant failed. There is already an outstanding invite for the chat.',
    [StringTemplates.TransferChat]: 'Transfer Chat',
    [StringTemplates.Participants]: 'Participants',
    [StringTemplates.Agent]: 'Agent',
    [StringTemplates.Customer]: 'Customer',
    [StringTemplates.Queue]: 'Queue',
    [StringTemplates.Remove]: 'Remove {{name}}',
    [StringTemplates.InvitedParticipants]: 'Invited Participants',
    [StringTemplates.CancelInvite]: 'Cancel invite to {{name}}',
    [StringTemplates.LeaveChat]: 'Leave Chat',
  },
  'es-MX': esMX,
  'pt-BR': ptBR,
  th,
  'zh-Hans': zhHans,
  'es-ES': esES,
});
