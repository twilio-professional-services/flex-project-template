import * as Flex from '@twilio/flex-ui';

import { FlexActionEvent, FlexAction } from '../../../../types/feature-loader';
import FlexHelper from '../../../../utils/flex-helper';
import ActivityManager, { reservedSystemActivities } from '../../helper/ActivityManager';
import { NotificationIds } from '../notifications/ActivityReservationHandler';

export const actionEvent = FlexActionEvent.before;
export const actionName = FlexAction.SetActivity;
export const actionHook = function beforeSetActivity(flex: typeof Flex, _manager: Flex.Manager) {
  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload, abortFunction) => {
    const { activityAvailable, activityName, isInvokedByPlugin } = payload;

    const hasAcceptedTasks = await FlexHelper.doesWorkerHaveReservationsInState(FlexHelper.RESERVATION_STATUS.ACCEPTED);
    const hasWrappingTasks = await FlexHelper.doesWorkerHaveReservationsInState(FlexHelper.RESERVATION_STATUS.WRAPPING);

    if (isInvokedByPlugin) {
      // We will allow any worker activity change invoked by the plugin to
      // proceed as normal
      return;
    }

    // disallow any state change to reserved activities
    if (reservedSystemActivities.map((a) => a.toLowerCase()).includes(activityName.toLowerCase())) {
      abortFunction();
      // Notify Agent
      Flex.Notifications.showNotification(NotificationIds.RestrictedActivities, {
        activityName,
      });
    } else if (hasAcceptedTasks || hasWrappingTasks) {
      // if worker requested to go to an offline state or an online state
      // and we are currently in the opposite, this will toggle acd status
      await ActivityManager.enforceEvaluatedState(activityAvailable);
      ActivityManager.storePendingActivityChange(activityName);

      // Notify User
      Flex.Notifications.showNotification(NotificationIds.ActivityChangeDelayed, {
        activityName,
      });

      // disallow switching states while tasks are in flight
      abortFunction();
    }
  });
};
