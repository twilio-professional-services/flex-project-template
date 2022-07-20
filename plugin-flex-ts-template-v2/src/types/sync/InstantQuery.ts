import { WorkerAttributes } from '../task-router/Worker';

export interface Worker {
  activity_name: string;
  attributes: WorkerAttributes;
  date_activity_changed?: string;
  date_updated: string;
  friendly_name: string;
  worker_activity_sid: string;
  worker_sid: string;
  workspace_sid: string;
}