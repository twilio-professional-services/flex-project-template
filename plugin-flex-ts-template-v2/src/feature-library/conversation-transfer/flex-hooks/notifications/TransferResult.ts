import { NotificationType } from '@twilio/flex-ui';

import { StringTemplates } from '../strings/ChatTransferStrings';

export enum NotificationIds {
  ChatTransferTaskSuccess = 'ChatTransferTaskSuccess',
  ChatParticipantInvited = 'ChatParticipantInvited',
  ChatTransferFailedGeneric = 'ChatTransferFailed',
  ChatTransferFailedConsultNotSupported = 'ChatTransferFailedConsultNotSupported',
  ChatTransferFailedColdNotSupported = 'ChatTransferFailedColdNotSupported',
  ChatTransferFailedAlreadyParticipating = 'ChatTransferFailedAlreadyParticipating',
  ChatRemoveParticipantFailed = 'ChatRemoveParticipantFailed',
  ChatRemoveParticipantSuccess = 'ChatRemoveParticipantSuccess',
  ChatCancelParticipantInviteFailed = 'ChatCancelParticipantInviteFailed',
  ChatCancelParticipantInviteSuccess = 'ChatCancelParticipantInviteSuccess',
  ChatCancelParticipantInviteFailedInviteOutstanding = 'ChatCancelParticipantInviteFailedInviteOutstanding',
}

export const notificationHook = () => [
  {
    id: NotificationIds.ChatTransferTaskSuccess,
    closeButton: true,
    content: StringTemplates.ChatTransferTaskSuccess,
    timeout: 3000,
    type: NotificationType.success,
  },
  {
    id: NotificationIds.ChatParticipantInvited,
    closeButton: true,
    content: StringTemplates.ChatParticipantInvited,
    timeout: 3000,
    type: NotificationType.success,
  },
  {
    id: NotificationIds.ChatTransferFailedGeneric,
    closeButton: true,
    content: StringTemplates.ChatTransferFailedGeneric,
    timeout: 3000,
    type: NotificationType.error,
  },
  {
    id: NotificationIds.ChatTransferFailedConsultNotSupported,
    closeButton: true,
    content: StringTemplates.ChatTransferFailedConsultNotSupported,
    timeout: 3000,
    type: NotificationType.error,
  },
  {
    id: NotificationIds.ChatTransferFailedColdNotSupported,
    closeButton: true,
    content: StringTemplates.ChatTransferFailedColdNotSupported,
    timeout: 3000,
    type: NotificationType.error,
  },
  {
    id: NotificationIds.ChatTransferFailedAlreadyParticipating,
    closeButton: true,
    content: StringTemplates.ChatTransferFailedAlreadyParticipating,
    timeout: 3000,
    type: NotificationType.error,
  },
  {
    id: NotificationIds.ChatRemoveParticipantFailed,
    closeButton: true,
    content: StringTemplates.ChatRemoveParticipantFailed,
    timeout: 3000,
    type: NotificationType.error,
  },
  {
    id: NotificationIds.ChatRemoveParticipantSuccess,
    closeButton: true,
    content: StringTemplates.ChatRemoveParticipantSuccess,
    timeout: 3000,
    type: NotificationType.success,
  },
  {
    id: NotificationIds.ChatCancelParticipantInviteFailed,
    closeButton: true,
    content: StringTemplates.ChatCancelParticipantInviteFailed,
    timeout: 3000,
    type: NotificationType.error,
  },
  {
    id: NotificationIds.ChatCancelParticipantInviteSuccess,
    closeButton: true,
    content: StringTemplates.ChatCancelParticipantInviteSuccess,
    timeout: 3000,
    type: NotificationType.success,
  },
  {
    id: NotificationIds.ChatCancelParticipantInviteFailedInviteOutstanding,
    closeButton: true,
    content: StringTemplates.ChatParticipantInviteOutstanding,
    timeout: 3000,
    type: NotificationType.error,
  },
];
