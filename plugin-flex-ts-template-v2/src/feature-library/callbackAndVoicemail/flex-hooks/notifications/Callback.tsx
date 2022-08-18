import * as Flex from '@twilio/flex-ui';
import { StringTemplates } from '../strings/Callback';

// Export the notification IDs an enum for better maintainability when accessing them elsewhere
export enum CallbackNotification {
  ErrorCallingCustomer = 'CallbackErrorCallingCustomer',
  ErrorRequeuingCallbackTask = 'CallbackErrorRequeuingCallbackTask',
  OutboundDialingNotEnabled = 'CallbackOutboundDialingNotEnabled'
};

export default (flex: typeof Flex, manager: Flex.Manager) => {
  errorCallingCustomer(flex, manager);
  outboundDialingNotEnabled(flex, manager);
}

function errorCallingCustomer(flex: typeof Flex, manager: Flex.Manager) {
  flex.Notifications.registerNotification({
    id: CallbackNotification.ErrorCallingCustomer,
    type: Flex.NotificationType.error,
    content: StringTemplates.ErrorCallingCustomer
  });
}

function outboundDialingNotEnabled(flex: typeof Flex, manager: Flex.Manager) {
  flex.Notifications.registerNotification({
    id: CallbackNotification.OutboundDialingNotEnabled,
    type: Flex.NotificationType.error,
    content: StringTemplates.OutboundDialingNotEnabled
  });
}
