import * as Flex from '@twilio/flex-ui';
import { StringTemplates } from '../strings/ChatToVideo';

// Export the notification IDs an enum for better maintainability when accessing them elsewhere
export enum ChatToVideoNotification {
  FailedVideoLinkNotification = 'PS_FailedVideoLink'
};

export default (flex: typeof Flex, manager: Flex.Manager) => {
  failedVideoLinkNotification(flex, manager);
}

function failedVideoLinkNotification(flex: typeof Flex, manager: Flex.Manager) {
  flex.Notifications.registerNotification({
    id: ChatToVideoNotification.FailedVideoLinkNotification,
    type: Flex.NotificationType.error,
    content: StringTemplates.FailedVideoLinkNotification
  });
}