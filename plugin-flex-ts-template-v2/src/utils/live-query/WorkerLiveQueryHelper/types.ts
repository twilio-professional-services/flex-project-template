import { Worker } from '../../../types/sync/LiveQuery';

export interface LiveQueryWorkerAddedEvent {
  key: string;
  value: Worker;
}

export interface LiveQueryWorkerUpdatedEvent {
  key: string;
  value: Worker;
}

export interface LiveQueryWorkerRemovedEvent {
  key: string;
}
