import * as Flex from '@twilio/flex-ui';

import { Activity } from '../../types/task-router';
import { QueueInstantQuery, WorkerInstantQuery, ReservationInstantQuery } from '../index-query/InstantQueryHelper';
import { QueueIndexItem, WorkerIndexItem, ReservationIndexItem } from '../index-query/InstantQueryHelper/types';

enum RESERVATION_STATUS {
  ACCEPTED = 'accepted',
  WRAPPING = 'wrapping',
  WRAPUP = 'wrapup', // for reservations looked up in the index, the status is inexplicably WRAPUP instead of WRAPPING
  PENDING = 'pending',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
  CANCELLED = 'canceled',
  RESCINDED = 'rescinded',
  TIMEOUT = 'timeout',
}

const UNKNOWN_ACTIVITY = 'UNKNOWN ACTIVITY';

const manager = Flex.Manager.getInstance();

const getFlexState = () => {
  return manager.store.getState().flex;
};

class FlexHelper {
  RESERVATION_STATUS = RESERVATION_STATUS;

  workerActivities = (getFlexState().worker?.activities || new Map()) as Map<string, Activity>;

  // NOTE selected task sid is actually a reservation sid
  getSelectedTaskSid = (): string | undefined => {
    return getFlexState().view.selectedTaskSid;
  };

  // NOTE this actually returns a reservation sid
  getSelectedTaskStatus = (): string | undefined => {
    const taskSid = this.getSelectedTaskSid();
    if (taskSid) return Flex.TaskHelper.getTaskByTaskSid(taskSid)?.status;
    return undefined;
  };

  getActivityByName = (activityName: string): Activity | undefined => {
    const activities = [...this.workerActivities.values()];
    return activities.find((a) => a?.name?.toLowerCase() === activityName.toLowerCase());
  };

  getActivityBySid = (activitySid: string): Activity | undefined => {
    const activities = [...this.workerActivities.values()];
    return activities.find((a) => a?.sid === activitySid);
  };

  getWorkerActivity = async (workerSid?: string): Promise<Activity | undefined> => {
    if (!workerSid) return manager.workerClient?.activity;
    const worker = await this.getWorker(workerSid);

    if (worker) return this.getActivityByName(worker.activity_name);
    return undefined;
  };

  getWorkerActivityName = async (workerSid?: string): Promise<string> => {
    const workerAcivity = await this.getWorkerActivity(workerSid);
    return workerAcivity?.name || UNKNOWN_ACTIVITY;
  };

  getWorkerReservations = async (workerSid?: string): Promise<Map<string, ReservationIndexItem | Flex.ITask>> => {
    // the tasks on the worker are actually a reservation list
    if (!workerSid) return getFlexState().worker.tasks;
    const reservations = await ReservationInstantQuery(
      `data.worker_sid EQ "${workerSid}" AND data.status NOT IN ["${RESERVATION_STATUS.REJECTED}", "${RESERVATION_STATUS.COMPLETED}", "${RESERVATION_STATUS.RESCINDED}", "${RESERVATION_STATUS.CANCELLED}", "${RESERVATION_STATUS.TIMEOUT}"]`,
    );
    const reservationMap = new Map();
    Object.keys(reservations).forEach((key) => {
      reservationMap.set(key, reservations[key]);
    });
    if (reservationMap) return reservationMap;
    return new Map();
  };

  getQueue = async (queueSid: string): Promise<QueueIndexItem | undefined> => {
    const queueResult = await QueueInstantQuery(`data.queue_sid EQ "${queueSid}"`);
    const queue = queueResult[queueSid];
    if (!queue) console.warn(`FlexHelper.getQueue(): unable to find queue for queuesid ${queueSid}`);
    return queue;
  };

  getWorker = async (workerSid: string): Promise<WorkerIndexItem | undefined> => {
    const workerResult = await WorkerInstantQuery(`data.worker_sid EQ "${workerSid}"`);
    const worker = workerResult[workerSid];
    if (!worker) console.warn(`FlexHelper.getWorker(): unable to find worker for workersid ${workerSid}`);
    return worker;
  };

  getCurrentWorker = (): Flex.IWorker | undefined => {
    return getFlexState().worker.worker;
  };

  doesWorkerHaveReservationsInState = async (status: RESERVATION_STATUS, workersid?: string): Promise<boolean> => {
    const reservations = await this.getWorkerReservations(workersid);
    if (reservations.size < 1) return false;
    return [...reservations.values()].some((reservation) => reservation.status === status);
  };

  doesWorkerHaveAPendingOutboundCall = async (workerSid?: string): Promise<boolean> => {
    let reservations: Map<string, ReservationIndexItem | Flex.ITask>;
    if (workerSid) reservations = await this.getWorkerReservations(workerSid);
    else reservations = getFlexState().worker.tasks;

    let result = false;
    reservations.forEach((reservation) => {
      if (reservation.status === RESERVATION_STATUS.PENDING && reservation.attributes.direction === 'outbound')
        result = true;
    });
    return result;
  };
}

const FlexHelperSingleton = new FlexHelper();

export default FlexHelperSingleton;
