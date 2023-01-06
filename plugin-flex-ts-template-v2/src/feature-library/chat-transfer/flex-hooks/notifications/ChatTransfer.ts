import * as Flex from '@twilio/flex-ui';
import { StringTemplates } from '../strings/ChatTransfer';

// Export the notification IDs an enum for better maintainability when accessing them elsewhere
export enum ChatTransferNotification {
  ErrorTransferringChat = 'ErrorTransferringChat',
  ErrorUpdatingTaskForChatTransfer = 'ErrorUpdatingTaskForChatTransfer'
};

export default (flex: typeof Flex, manager: Flex.Manager) => {
  ErrorTransferringChat(flex, manager);
  warnDuringTransfer(flex, manager);
}

function ErrorTransferringChat(flex: typeof Flex, manager: Flex.Manager) {
  flex.Notifications.registerNotification({
    id: ChatTransferNotification.ErrorTransferringChat,
    content: StringTemplates.FailedToSubmitTransfer,
    type: flex.NotificationType.error,
  });
}

function warnDuringTransfer(flex: typeof Flex, manager: Flex.Manager) {
  flex.Notifications.registerNotification({
    id: ChatTransferNotification.ErrorUpdatingTaskForChatTransfer,
    content: StringTemplates.FailedToUpdateTaskAttributes,
    type: flex.NotificationType.warning,
  });
}
