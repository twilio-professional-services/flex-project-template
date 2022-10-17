import * as Flex from '@twilio/flex-ui';
import { StringTemplates } from '../strings/TeamViewQueueFilter';

// Export the notification IDs an enum for better maintainability when accessing them elsewhere
export enum TeamViewQueueFilterNotification {
  ErrorParsingQueueExpression = 'ErrorParsingQueueExpression',
  ErrorParsingQueueExpressionWithOR = 'ErrorParsingQueueExpressionWithOR',
  ErrorLoadingQueue = 'ErrorLoadingQueue'
};

export default (flex: typeof Flex, manager: Flex.Manager) => {
  errorParsingQueueFilterExpression(flex, manager);
}

function errorParsingQueueFilterExpression(flex: typeof Flex, manager: Flex.Manager) {
  flex.Notifications.registerNotification({
    id: TeamViewQueueFilterNotification.ErrorParsingQueueExpression,
    type: Flex.NotificationType.warning,
    content: StringTemplates.ErrorParsingQueueExpression
  });

  flex.Notifications.registerNotification({
    id: TeamViewQueueFilterNotification.ErrorParsingQueueExpressionWithOR,
    type: Flex.NotificationType.warning,
    content: StringTemplates.ErrorParsingQueueExpressionWithOR
  });

  flex.Notifications.registerNotification({
    id: TeamViewQueueFilterNotification.ErrorLoadingQueue,
    type: Flex.NotificationType.warning,
    content: StringTemplates.ErrorQueueNotFound
  });
}
