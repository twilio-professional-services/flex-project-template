import * as Flex from "@twilio/flex-ui";
import { NotificationType, Notifications } from "@twilio/flex-ui";
import { StringTemplates } from "../strings/ChatTransferStrings";

export enum NotificationIds {
  ChatTransferTaskSuccess = "ChatTransferTaskSuccess",
  ChatTransferFailedGeneric = "ChatTransferFailed",
  ChatTransferFailedConsultNotSupported = "ChatTransferFailedConsultNotSupported",
}

export default (flex: typeof Flex, manager: Flex.Manager) => {
  chatTransferTaskSuccess();
  chatTransferFailedGeneric();
  chatTransferFailedConsultNotSupported();
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
