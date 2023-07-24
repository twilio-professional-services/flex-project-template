import * as Flex from '@twilio/flex-ui';

import { FlexActionEvent, FlexAction } from '../../../../types/feature-loader';
import ActivityManager, {
  rerservedSystemActivities,
  hasAcceptedTasks,
  hasWrappingTasks,
  getActivityByName,
} from '../../helper/ActivityManager';
import { NotificationIds } from '../notifications/ActivityReservationHandler';
import { Worker } from '../../../../types/task-router';

export const actionEvent = FlexActionEvent.before;
export const actionName = FlexAction.SetWorkerActivity;
export const actionHook = function beforeSetActivity(flex: typeof Flex, _manager: Flex.Manager) {
  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload, abortFunction) => {
    const { activityName, isInvokedByPlugin, workerSid } = payload;

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

      // get the worker name
      const WorkerInstantQuery = async (queryExpression: string): Promise<{ [workerSid: string]: any }> => {
        const { insightsClient } = Flex.Manager.getInstance();
        const query = await insightsClient.instantQuery('tr-worker');
        return new Promise((resolve, reject) => {
          try {
            query.once('searchResult', (queues) => resolve(queues));
            query.search(queryExpression);
          } catch (e) {
            reject(e);
          }
        });
      };

      const getWorkerFriendlyName = (worker: Worker) => {
        return worker?.attributes?.full_name || workerSid;
      };

      const workerResult = await WorkerInstantQuery(`data.worker_sid EQ "${workerSid}"`);
      const workerFriendlyName = getWorkerFriendlyName(workerResult[workerSid]);

      // Notify User
      Flex.Notifications.showNotification(NotificationIds.SupervisorActivityChangeDelayed, {
        activityName,
        agentName: workerFriendlyName,
      });

      // disallow switching states while tasks are in flight and
      abortFunction();
    }
  });
};
