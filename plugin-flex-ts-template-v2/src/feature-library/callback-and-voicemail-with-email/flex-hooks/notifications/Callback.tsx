import * as Flex from '@twilio/flex-ui';

import { StringTemplates } from '../strings/Callback';

// Export the notification IDs an enum for better maintainability when accessing them elsewhere
export enum CallbackNotification {
  ErrorCallingCustomer = 'CallbackErrorCallingCustomer',
  ErrorRequeuingCallbackTask = 'CallbackErrorRequeuingCallbackTask',
  OutboundDialingNotEnabled = 'CallbackOutboundDialingNotEnabled',
}

export const notificationHook = (_flex: typeof Flex, _manager: Flex.Manager) => [
  {
    id: CallbackNotification.ErrorCallingCustomer,
    type: Flex.NotificationType.error,
    content: StringTemplates.ErrorCallingCustomer,
  },
  {
    id: CallbackNotification.OutboundDialingNotEnabled,
    type: Flex.NotificationType.error,
    content: StringTemplates.OutboundDialingNotEnabled,
  },
];
