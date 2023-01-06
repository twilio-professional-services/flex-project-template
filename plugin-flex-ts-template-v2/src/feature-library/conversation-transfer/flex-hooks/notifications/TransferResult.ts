import * as Flex from "@twilio/flex-ui";
import { NotificationType, Notifications } from "@twilio/flex-ui";
import { StringTemplates } from "../strings/ChatTransferStrings";

export enum NotificationIds {
  ChatTransferTaskSuccess = "ChatTransferTaskSuccess",
  ChatParticipantInvited = "ChatParticipantInvited",
  ChatTransferFailedGeneric = "ChatTransferFailed",
  ChatTransferFailedConsultNotSupported = "ChatTransferFailedConsultNotSupported",
  ChatRemoveParticipantFailed = "ChatRemoveParticipantFailed",
  ChatRemoveParticipantSuccess = "ChatRemoveParticipantSuccess",
  ChatCancelParticipantInviteFailed = "ChatCancelParticipantInviteFailed",
  ChatCancelParticipantInviteSuccess = "ChatCancelParticipantInviteSuccess",
  ChatCancelParticipantInviteFailedInviteOutstanding = "ChatCancelParticipantInviteFailedInviteOutstanding",
}

export default (flex: typeof Flex, manager: Flex.Manager) => {
  chatTransferTaskSuccess();
  chatParticipantInvitedSuccess();
  chatTransferFailedGeneric();
  chatTransferFailedConsultNotSupported();
  chatRemoveParticipantFailed();
  chatRemoveParticipantSuccess();
  chatCancelParticipantInviteFailed();
  chatCancelParticipantInviteSuccess();
  chatCancelParticipantInviteFailedInviteOutstanding();
};

const chatTransferTaskSuccess = () => {
  Notifications.registerNotification({
    id: NotificationIds.ChatTransferTaskSuccess,
    closeButton: true,
    content: StringTemplates.ChatTransferTaskSuccess,
    timeout: 3000,
    type: NotificationType.success,
  });
};

const chatParticipantInvitedSuccess = () => {
  Notifications.registerNotification({
    id: NotificationIds.ChatParticipantInvited,
    closeButton: true,
    content: StringTemplates.ChatParticipantInvited,
    timeout: 3000,
    type: NotificationType.success,
  });
};

const chatTransferFailedGeneric = () => {
  Notifications.registerNotification({
    id: NotificationIds.ChatTransferFailedGeneric,
    closeButton: true,
    content: StringTemplates.ChatTransferFailedGeneric,
    timeout: 3000,
    type: NotificationType.error,
  });
};

const chatTransferFailedConsultNotSupported = () => {
  Notifications.registerNotification({
    id: NotificationIds.ChatTransferFailedConsultNotSupported,
    closeButton: true,
    content: StringTemplates.ChatTransferFailedConsultNotSupported,
    timeout: 3000,
    type: NotificationType.error,
  });
};

const chatRemoveParticipantFailed = () => {
  Notifications.registerNotification({
    id: NotificationIds.ChatRemoveParticipantFailed,
    closeButton: true,
    content: StringTemplates.ChatRemoveParticipantFailed,
    timeout: 3000,
    type: NotificationType.error,
  });
};

const chatRemoveParticipantSuccess = () => {
  Notifications.registerNotification({
    id: NotificationIds.ChatRemoveParticipantSuccess,
    closeButton: true,
    content: StringTemplates.ChatRemoveParticipantSuccess,
    timeout: 3000,
    type: NotificationType.success,
  });
};

const chatCancelParticipantInviteFailed = () => {
  Notifications.registerNotification({
    id: NotificationIds.ChatCancelParticipantInviteFailed,
    closeButton: true,
    content: StringTemplates.ChatCancelParticipantInviteFailed,
    timeout: 3000,
    type: NotificationType.error,
  });
};

const chatCancelParticipantInviteSuccess = () => {
  Notifications.registerNotification({
    id: NotificationIds.ChatCancelParticipantInviteSuccess,
    closeButton: true,
    content: StringTemplates.ChatCancelParticipantInviteSuccess,
    timeout: 3000,
    type: NotificationType.success,
  });
};

const chatCancelParticipantInviteFailedInviteOutstanding = () => {
  Notifications.registerNotification({
    id: NotificationIds.ChatCancelParticipantInviteFailedInviteOutstanding,
    closeButton: true,
    content: StringTemplates.ChatParticipantInviteOutstanding,
    timeout: 3000,
    type: NotificationType.error,
  });
};
