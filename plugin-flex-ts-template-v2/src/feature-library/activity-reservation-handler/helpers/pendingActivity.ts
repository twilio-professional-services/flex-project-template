import FlexHelper from './flexHelper';
import { systemActivities } from './systemActivities';
import WorkerActivity from './workerActivityHelper';
import PendingActivity from '../types/PendingActivity';

const pendingActivityChangeItemKey = `pendingActivityChange_${FlexHelper.accountSid}`;

const shouldStoreCurrentActivitySid = () => {
  return !systemActivities.map((a) => a.toLowerCase()).includes((WorkerActivity.activityName as string).toLowerCase());
};

export const storePendingActivityChange = (activity: any, isUserSelected?: boolean) => {
  // Pulling out only the relevant activity properties to avoid
  // a circular structure error in JSON.stringify()
  const pendingActivityChange: PendingActivity = {
    available: activity.available,
    isUserSelected: Boolean(isUserSelected),
    name: activity.name,
    sid: activity.sid,
  };

  localStorage.setItem(pendingActivityChangeItemKey, JSON.stringify(pendingActivityChange));
};

export const storeCurrentActivitySidIfNeeded = () => {
  if (shouldStoreCurrentActivitySid()) {
    const { activity: workerActivity } = WorkerActivity;

    console.debug('Storing current activity as pending activity:', workerActivity?.name);
    storePendingActivityChange(WorkerActivity.activity);
  }
};

export const getPendingActivity = (): PendingActivity => {
  const item = localStorage.getItem(pendingActivityChangeItemKey);

  const pendingActivity: PendingActivity = item && JSON.parse(item);
  return pendingActivity;
};

export const clearPendingActivityChange = () => {
  localStorage.removeItem(pendingActivityChangeItemKey);
};
