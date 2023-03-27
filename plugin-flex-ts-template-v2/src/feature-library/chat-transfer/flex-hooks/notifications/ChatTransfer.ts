import * as Flex from '@twilio/flex-ui';

import { StringTemplates } from '../strings/ChatTransfer';

// Export the notification IDs an enum for better maintainability when accessing them elsewhere
export enum ChatTransferNotification {
  ErrorTransferringChat = 'ErrorTransferringChat',
  ErrorUpdatingTaskForChatTransfer = 'ErrorUpdatingTaskForChatTransfer',
}

export const notificationHook = (flex: typeof Flex, _manager: Flex.Manager) => [
  {
    id: ChatTransferNotification.ErrorTransferringChat,
    content: StringTemplates.FailedToSubmitTransfer,
    type: flex.NotificationType.error,
  },
  {
    id: ChatTransferNotification.ErrorUpdatingTaskForChatTransfer,
    content: StringTemplates.FailedToUpdateTaskAttributes,
    type: flex.NotificationType.warning,
  },
];
