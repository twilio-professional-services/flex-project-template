import * as Flex from '@twilio/flex-ui';
import ChatNotificationMessage from '../../custom-components/ChatNotificationMessage';

export function replaceMessageForNotifications(flex: typeof Flex, manager: Flex.Manager) {

  flex.MessageListItem.Content.replace(<ChatNotificationMessage
    key='Notification-Message'
  />, {
    if: (props) => props.message.source.attributes.notification === true,
  });
}
