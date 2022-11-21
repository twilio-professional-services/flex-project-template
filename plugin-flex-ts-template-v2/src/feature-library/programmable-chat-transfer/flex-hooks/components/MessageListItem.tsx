import * as Flex from '@twilio/flex-ui';
import ChatNotificationMessage from '../../custom-components/ChatNotificationMessage';

import { UIAttributes } from 'types/manager/ServiceConfiguration';

const { custom_data } = Flex.Manager.getInstance().configuration as UIAttributes;
const { enabled } = custom_data.features.chat_transfer;

export function replaceMessageForNotifications(flex: typeof Flex, manager: Flex.Manager) {

  if(!enabled) return;

  flex.MessageListItem.Content.replace(<ChatNotificationMessage
    key='Notification-Message'
  />, {
    if: (props) => props.message.source.attributes.notification === true,
  });
}
