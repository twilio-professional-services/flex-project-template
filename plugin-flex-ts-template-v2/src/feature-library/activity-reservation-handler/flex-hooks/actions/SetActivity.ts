import * as Flex from '@twilio/flex-ui';

import { FlexActionEvent, FlexAction } from '../../../../types/feature-loader';
import ActivityManager, {
  rerservedSystemActivities,
  hasAcceptedTasks,
  hasWrappingTasks,
  getActivityByName,
} from '../../helper/ActivityManager';
import { NotificationIds } from '../notifications/ActivityReservationHandler';

export const actionEvent = FlexActionEvent.before;
export const actionName = FlexAction.SetActivity;
export const actionHook = function beforeSetActivity(flex: typeof Flex, _manager: Flex.Manager) {
  flex.Actions.addListener(`${actionEvent}${actionName}`, (payload, abortFunction) => {
    const { activityName, isInvokedByPlugin } = payload;

    if (isInvokedByPlugin) {
      // We will allow any worker activity change invoked by the plugin to
      // proceed as normal
      return;
    }

    // disallow any state change to reserved activities
    if (rerservedSystemActivities.map((a) => a.toLowerCase()).includes(activityName.toLowerCase())) {
      abortFunction();
      // Notify Agent
      Flex.Notifications.showNotification(NotificationIds.RestrictedActivities, {
        activityName,
      });
    } else if (hasAcceptedTasks() || hasWrappingTasks()) {
      // if worker requested to go to an offline state or an online state
      // and we are currently in the opposite, this will toggle acd status
      ActivityManager.updateState(getActivityByName(activityName)?.available);

      // store change for later
      ActivityManager.storePendingActivityChange(activityName);

      // Notify User
      Flex.Notifications.showNotification(NotificationIds.ActivityChangeDelayed, {
        activityName,
      });

      // disallow switching states while tasks are in flight and
      abortFunction();
    }
  });
};
