import { TaskAttributes } from '../../../types/task-router/Task';
import { CustomWorkerAttributes } from '../../../types/task-router/Worker';

export interface WorkerIndexItem {
  activity_name: string;
  attributes: CustomWorkerAttributes;
  date_activity_changed: Date;
  date_updated: Date;
  friendly_name: string;
  worker_activity_sid: string;
  worker_sid: string;
  workspace_sid: string;
}

export interface ReservationIndexItem {
  attributes: TaskAttributes;
  date_created: Date;
  date_updated: Date;
  queue_name: string;
  reservation_sid: string;
  status: string;
  task_age: number;
  task_channel_unique_name: string;
  task_date_created: Date;
  task_priority: number;
  task_sid: string;
  task_status: string;
  worker_name: string;
  worker_sid: string;
  workspace_sid: string;
}

export interface TaskIndexItem {
  accepted_reservation_sid: string;
  age: number;
  attributes: TaskAttributes;
  channel_type: string;
  channel_unique_name: string;
  date_created: Date;
  date_updated: Date;
  priority: number;
  queue_name: string;
  status: string;
  task_sid: string;
  worker_name: string;
  worker_sid: string;
  workspace_sid: string;
}
