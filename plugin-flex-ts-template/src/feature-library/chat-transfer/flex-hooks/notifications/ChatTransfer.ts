import * as Flex from '@twilio/flex-ui';
import { StringTemplates } from '../strings/ChatTransfer';

// Export the notification IDs an enum for better maintainability when accessing them elsewhere
export enum ChatTransferNotification {
  ErrorTransferingChat = 'ErrorTransferingChat',
  ErrorUpdatingTaskForChatTransfer = 'ErrorUpdatingTaskForChatTransfer'
};

export default (flex: typeof Flex, manager: Flex.Manager) => {
  errorTransferingChat(flex, manager);
  warnDuringTransfer(flex, manager);
}

function errorTransferingChat(flex: typeof Flex, manager: Flex.Manager) {
  flex.Notifications.registerNotification({
    id: ChatTransferNotification.ErrorTransferingChat,
    content: StringTemplates.FailedToSumitTransfer,
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
