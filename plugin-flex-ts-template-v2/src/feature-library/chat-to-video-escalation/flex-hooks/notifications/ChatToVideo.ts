import * as Flex from '@twilio/flex-ui';

import { StringTemplates } from '../strings/ChatToVideo';

// Export the notification IDs an enum for better maintainability when accessing them elsewhere
export enum ChatToVideoNotification {
  FailedVideoLinkNotification = 'PS_FailedVideoLink',
}

export const notificationHook = (_flex: typeof Flex, _manager: Flex.Manager) => [
  {
    id: ChatToVideoNotification.FailedVideoLinkNotification,
    type: Flex.NotificationType.error,
    content: StringTemplates.FailedVideoLinkNotification,
  },
];
