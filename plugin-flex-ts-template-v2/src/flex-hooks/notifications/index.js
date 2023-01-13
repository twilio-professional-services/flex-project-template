import featureNotifications from "../../feature-library/*/flex-hooks/notifications/*";

export default (flex, manager) => {
  
  // TODO: I'd like to change this over such that features provide an array of notification definitions for the template to register if the feature is enabled
  
  featureNotifications.forEach((file) => {
    file.default(flex, manager);
  });
  
  // Dismiss the Flex Insights error that always happens when running from localhost
  if (window.location.hostname === 'localhost') {
    flex.Notifications.dismissNotificationById('FlexInsightsDataFetchFailed');
  }
};
