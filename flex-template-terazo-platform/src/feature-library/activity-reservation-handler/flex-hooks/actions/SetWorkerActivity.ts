import * as Flex from '@twilio/flex-ui';

import FlexState from '../../helpers/flexHelper';
import { delayActivityChange } from '../../config';
import { NotificationIds } from '../notifications/ActivityReservationHandler';
import { systemActivities } from '../../helpers/systemActivities';
import { FlexActionEvent, FlexAction } from '../../../../types/feature-loader';

export const actionEvent = FlexActionEvent.before;
export const actionName = FlexAction.SetActivity;
export const actionHook = function beforeSetActivity(flex: typeof Flex, _manager: Flex.Manager) {
  flex.Actions.addListener(`${actionEvent}${actionName}`, (payload, abortFunction) => {
    const { activityName, activitySid, isInvokedByPlugin } = payload;

    if (isInvokedByPlugin) {
      // We will allow any worker activity change invoked by the plugin to
      // proceed as normal
      return;
    }

    if (systemActivities.map((a) => a.toLowerCase()).includes(activityName.toLowerCase())) {
      abortFunction();
      flex.Notifications.showNotification(NotificationIds.RestrictedActivities, {
        activityName,
      });
    } else if (FlexState.hasActiveCallTask || FlexState.hasWrappingTask) {
      abortFunction();
      const targetActivity = FlexState.getActivityBySid(activitySid);
      delayActivityChange(targetActivity);
    }
  });
};
