import * as Flex from '@twilio/flex-ui';
import { StringTemplates } from '../../strings/BrowserPop';

// Export the notification IDs an enum for better maintainability when accessing them elsewhere
export enum BrowserPopNotification {
  ErrorLaunchingBrowserPop = 'BrowserPopErrorLaunchingBrowserTab'
};

export default (flex: typeof Flex, manager: Flex.Manager) => {
    errorLaunchingBrowserPop(flex, manager);
}

function errorLaunchingBrowserPop(flex: typeof Flex, manager: Flex.Manager) {
  flex.Notifications.registerNotification({
      id: BrowserPopNotification.ErrorLaunchingBrowserPop,
    type: Flex.NotificationType.error,
    content: StringTemplates.ErrorLaunchingBrowserPop
  });
}
