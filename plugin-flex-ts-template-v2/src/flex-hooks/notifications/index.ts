import * as Flex from "@twilio/flex-ui";
// @ts-ignore
import featureNotifications from "../../feature-library/*/flex-hooks/notifications/*";

export default (flex: typeof Flex, manager: Flex.Manager) => {
  
  // TODO: I'd like to change this over such that features provide an array of notification definitions for the template to register if the feature is enabled
  
  if (typeof featureNotifications !== 'undefined') {
    featureNotifications.forEach((file: any) => {
      file.default(flex, manager);
    });
  }
  
  // Dismiss the Flex Insights error that always happens when running from localhost
  if (window.location.hostname === 'localhost') {
    flex.Notifications.dismissNotificationById('FlexInsightsDataFetchFailed');
  }
};
