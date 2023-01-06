import * as Flex from '@twilio/flex-ui';
import ChatNotificationMessage from '../../custom-components/ChatNotificationMessage';
import { isFeatureEnabled } from '../../index';

export function replaceMessageForNotifications(flex: typeof Flex, manager: Flex.Manager) {

  if(!isFeatureEnabled()) return;

  flex.MessageListItem.Content.replace(<ChatNotificationMessage
    key='Notification-Message'
  />, {
    if: (props) => props.message.source.attributes.notification === true,
  });
}
