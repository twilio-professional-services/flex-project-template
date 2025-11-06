import * as Flex from '@twilio/flex-ui';

import { QueueIndexItem, WorkerIndexItem, ReservationIndexItem, TaskIndexItem } from './types';

enum SyncIndex {
  Task = 'tr-task',
  Worker = 'tr-worker',
  Reservation = 'tr-reservation',
  Queue = 'tr-queue',
}

export const QueueInstantQuery = async (queryExpression: string): Promise<{ [queueSid: string]: QueueIndexItem }> => {
  const { insightsClient } = Flex.Manager.getInstance();
  const query = await insightsClient.instantQuery(SyncIndex.Queue);
  return new Promise((resolve, reject) => {
    try {
      query.once('searchResult', (result) => resolve(result));
      query.search(queryExpression);
    } catch (e) {
      reject(e);
    }
  });
};

export const WorkerInstantQuery = async (
  queryExpression: string,
): Promise<{ [workerSid: string]: WorkerIndexItem }> => {
  const { insightsClient } = Flex.Manager.getInstance();
  const query = await insightsClient.instantQuery(SyncIndex.Worker);
  return new Promise((resolve, reject) => {
    try {
      query.once('searchResult', (result) => resolve(result));
      query.search(queryExpression);
    } catch (e) {
      reject(e);
    }
  });
};

export const TasksInstantQuery = async (queryExpression: string): Promise<{ [taskSid: string]: TaskIndexItem }> => {
  const { insightsClient } = Flex.Manager.getInstance();
  const query = await insightsClient.instantQuery(SyncIndex.Task);
  return new Promise((resolve, reject) => {
    try {
      query.once('searchResult', (result) => resolve(result));
      query.search(queryExpression);
    } catch (e) {
      reject(e);
    }
  });
};

export const ReservationInstantQuery = async (
  queryExpression: string,
): Promise<{ [reservationSid: string]: ReservationIndexItem }> => {
  const { insightsClient } = Flex.Manager.getInstance();
  const query = await insightsClient.instantQuery(SyncIndex.Reservation);
  return new Promise((resolve, reject) => {
    try {
      query.once('searchResult', (result) => resolve(result));
      query.search(queryExpression);
    } catch (e) {
      reject(e);
    }
  });
};
