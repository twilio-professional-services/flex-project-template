import * as Flex from "@twilio/flex-ui";
import notificationsToRegister from "./notifications";

export default (flex: typeof Flex, manager: Flex.Manager) => {
  notificationsToRegister.forEach((notificationToRegister) => {
    notificationToRegister(flex, manager);
  });
  
  // Dismiss the Flex Insights error that always happens when running from localhost
  if (window.location.hostname === 'localhost') {
    flex.Notifications.dismissNotificationById('FlexInsightsDataFetchFailed');
  }
};
