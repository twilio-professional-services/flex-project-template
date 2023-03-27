import * as Flex from '@twilio/flex-ui';

import { StringTemplates } from '../strings/TeamViewQueueFilter';

// Export the notification IDs an enum for better maintainability when accessing them elsewhere
export enum TeamViewQueueFilterNotification {
  ErrorParsingQueueExpression = 'ErrorParsingQueueExpression',
  ErrorParsingQueueExpressionWithOR = 'ErrorParsingQueueExpressionWithOR',
  ErrorLoadingQueue = 'ErrorLoadingQueue',
}

export const notificationHook = (_flex: typeof Flex, _manager: Flex.Manager) => [
  {
    id: TeamViewQueueFilterNotification.ErrorParsingQueueExpression,
    type: Flex.NotificationType.warning,
    content: StringTemplates.ErrorParsingQueueExpression,
  },
  {
    id: TeamViewQueueFilterNotification.ErrorParsingQueueExpressionWithOR,
    type: Flex.NotificationType.warning,
    content: StringTemplates.ErrorParsingQueueExpressionWithOR,
  },
  {
    id: TeamViewQueueFilterNotification.ErrorLoadingQueue,
    type: Flex.NotificationType.warning,
    content: StringTemplates.ErrorQueueNotFound,
  },
];
