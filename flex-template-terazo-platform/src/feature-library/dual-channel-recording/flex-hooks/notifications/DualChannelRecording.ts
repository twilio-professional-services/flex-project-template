import * as Flex from '@twilio/flex-ui';
import { NotificationType } from '@twilio/flex-ui';

import { StringTemplates } from '../strings/DualChannelRecording';

export enum NotificationIds {
  DualChannelBroken = 'PSDualChannelBroken',
}

export const notificationHook = (_flex: typeof Flex, _manager: Flex.Manager) => [
  {
    id: NotificationIds.DualChannelBroken,
    closeButton: true,
    content: StringTemplates.DualChannelBroken,
    timeout: 0,
    type: NotificationType.error,
  },
];
