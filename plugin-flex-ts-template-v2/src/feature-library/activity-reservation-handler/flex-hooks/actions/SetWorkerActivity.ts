import * as Flex from '@twilio/flex-ui';

import { FlexActionEvent, FlexAction } from '../../../../types/feature-loader';
import { rerservedSystemActivities } from '../../helper/ActivityManager';
import { NotificationIds } from '../notifications/ActivityReservationHandler';
import { Activity, Worker } from '../../../../types/task-router';

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

const TasksInstantQuery = async (queryExpression: string): Promise<{ [taskSid: string]: Flex.ITask }> => {
  const { insightsClient } = Flex.Manager.getInstance();
  const query = await insightsClient.instantQuery('tr-task');
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
  return worker?.attributes?.full_name || worker.sid;
};

const hasAcceptedTasks = (tasks: { [taskSid: string]: Flex.ITask }): boolean => {
  if (!tasks) return false;
  return [...Object.values(tasks)].some((task) => task.status === 'accepted');
};

const hasWrappingTasks = (tasks: { [taskSid: string]: Flex.ITask }): boolean => {
  if (!tasks) return false;
  return [...Object.values(tasks)].some((task) => task.status === 'wrapping');
};

export const actionEvent = FlexActionEvent.before;
export const actionName = FlexAction.SetWorkerActivity;
export const actionHook = function beforeSetActivity(flex: typeof Flex, _manager: Flex.Manager) {
  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload, abortFunction) => {
    const { activitySid, activityName, isInvokedByPlugin, workerSid } = payload;

    if (isInvokedByPlugin) {
      // We will allow any worker activity change invoked by the plugin to
      // proceed as normal
      return;
    }

    // load the activity sso we can extract the name
    const requestedActivity = _manager.store.getState().flex.worker.activities.get(activitySid) as Activity;

    // load the worker so we can extract their name and
    const workerResult = await WorkerInstantQuery(`data.worker_sid EQ "${workerSid}"`);
    const worker = workerResult[workerSid];

    // load the tasks the worker currently has inflight so we can determine
    // whether to warn the supervisor that the agents state will be moved
    // to pending or not
    const tasksResult = await TasksInstantQuery(`data.worker_sid EQ "${workerSid}"`);

    // disallow any state change to reserved activities
    if (rerservedSystemActivities.map((a) => a.toLowerCase()).includes(requestedActivity.name.toLowerCase())) {
      abortFunction();
      // Notify Supervisor
      Flex.Notifications.showNotification(NotificationIds.RestrictedActivities, {
        activityName,
      });
    } else if (hasAcceptedTasks(tasksResult) || hasWrappingTasks(tasksResult)) {
      // NOTE: For the supervisor activity change
      // the activity will change immediately
      // on the workers client side the workerActivityUpdated event
      // will trigger a re-evaluation to make sure they are on the right state
      // and move them back into a system state if neccessary.

      // if the agents client is not active then they will not toggle into system state
      // and instead be exactly the state the supervisor put them in even if
      // tasks are in flight.

      // get the worker name
      const workerFriendlyName = getWorkerFriendlyName(worker);

      // Notify Supervisor of expected pending switch
      Flex.Notifications.showNotification(NotificationIds.SupervisorActivityChangeDelayed, {
        activityName,
        agentName: workerFriendlyName,
      });
    }
  });
};
