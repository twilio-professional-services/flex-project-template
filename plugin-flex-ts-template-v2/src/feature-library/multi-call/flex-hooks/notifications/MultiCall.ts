import * as Flex from '@twilio/flex-ui';
import { NotificationType } from '@twilio/flex-ui';
import { StringTemplates } from '../strings/MultiCall';

export enum NotificationIds {
  MultiCallBroken = 'PSMultiCallBroken'
}

export default (flex: typeof Flex, manager: Flex.Manager) => {
  multiCallBroken(flex, manager);
};

function multiCallBroken(flex: typeof Flex, manager: Flex.Manager) {
  flex.Notifications.registerNotification({
    id: NotificationIds.MultiCallBroken,
    closeButton: true,
    content: StringTemplates.MultiCallBroken,
    timeout: 0,
    type: NotificationType.error,
  });
}
