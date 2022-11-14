import { WorkerAttributes } from '../task-router/Worker'

export default interface Worker {
  activityDuration: string;
  activityName: string;
  attributes: WorkerAttributes;
  dateUpdated: Date;
  fullName: string;
  isAvailable: boolean;
  name: string;
  sid: string;
  source: {
    activity_name: string;
    attributes: WorkerAttributes;
    date_activity_changed: string;
    date_updated: string;
    friendly_name: string;
    worker_activity_sid: string;
    worker_sid: string;
    workspace_sid: string;
  };
}