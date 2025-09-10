import * as Flex from '@twilio/flex-ui';

import { FlexActionEvent, FlexAction } from '../../../../types/feature-loader';
import { SalesforceIntegrationNotification } from '../notifications';

export const actionEvent = FlexActionEvent.after;
export const actionName = FlexAction.SetActivity;
export const actionHook = function clearNotificationAfterSetActivity(flex: typeof Flex) {
  flex.Actions.addListener(`${actionEvent}${actionName}`, async () => {
    flex.Notifications.dismissNotificationById(SalesforceIntegrationNotification.UnableToCallOffline);
  });
};
