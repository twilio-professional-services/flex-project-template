import * as Flex from '@twilio/flex-ui';
import { Activity } from 'types/task-router';

import { FlexActionEvent, FlexAction } from '../../../../types/feature-loader';
import { reservedSystemActivities } from '../../helper/ActivityManager';
import { NotificationIds } from '../notifications/ActivityReservationHandler';
import { FlexHelper } from '../../../../utils/helpers';

export const actionEvent = FlexActionEvent.before;
export const actionName = FlexAction.SetWorkerActivity;
export const actionHook = function beforeSetActivity(flex: typeof Flex, _manager: Flex.Manager) {
  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload, abortFunction) => {
    const { activitySid, workerSid, isInvokedByPlugin } = payload;

    if (isInvokedByPlugin) {
      // We will allow any worker activity change invoked by the plugin to
      // proceed as normal
      return;
    }

    const activity = (await FlexHelper.getActivityBySid(activitySid)) as Activity;

    const hasAcceptedTasks = await FlexHelper.doesWorkerHaveReservationsInState(
      FlexHelper.RESERVATION_STATUS.ACCEPTED,
      workerSid,
    );

    // for reservations looked up in the index, the status is inexplicably WRAPUP instead of WRAPPING
    const hasWrappingTasks = await FlexHelper.doesWorkerHaveReservationsInState(
      FlexHelper.RESERVATION_STATUS.WRAPUP,
      workerSid,
    );

    // disallow any state change to reserved activities
    if (reservedSystemActivities.map((a) => a.toLowerCase()).includes(activity.name.toLowerCase())) {
      abortFunction();
      // Notify Supervisor
      Flex.Notifications.showNotification(NotificationIds.RestrictedActivities, {
        activityName: activity.name,
      });
    } else if (hasAcceptedTasks || hasWrappingTasks) {
      // NOTE: For the supervisor activity change
      // the activity will change immediately
      // on the workers client side the workerActivityUpdated event
      // will trigger a re-evaluation to make sure they are on the right state
      // and move them back into a system state if necessary.

      // Notify Supervisor of expected pending switch
      Flex.Notifications.showNotification(NotificationIds.SupervisorActivityChangeDelayed, {
        activityName: activity.name,
        agentName: (await FlexHelper.getWorker(workerSid))?.attributes.full_name,
      });
    }
  });
};
