import * as Flex from '@twilio/flex-ui';

import ChatNotificationMessage from '../../custom-components/ChatNotificationMessage';
import { FlexComponent } from '../../../../types/feature-loader';

export const componentName = FlexComponent.MessageListItem;
export const componentHook = function replaceMessageForNotifications(flex: typeof Flex, _manager: Flex.Manager) {
  (flex.MessageListItem.Content as any).replace(<ChatNotificationMessage key="Notification-Message" />, {
    if: (props: any) => props.message.source.attributes.notification === true,
  });
};
