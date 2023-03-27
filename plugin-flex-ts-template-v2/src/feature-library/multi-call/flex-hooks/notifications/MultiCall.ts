import * as Flex from '@twilio/flex-ui';
import { NotificationType } from '@twilio/flex-ui';

import { StringTemplates } from '../strings/MultiCall';

export enum NotificationIds {
  MultiCallBroken = 'PSMultiCallBroken',
}

export const notificationHook = (_flex: typeof Flex, _manager: Flex.Manager) => [
  {
    id: NotificationIds.MultiCallBroken,
    closeButton: true,
    content: StringTemplates.MultiCallBroken,
    timeout: 0,
    type: NotificationType.error,
  },
];
