import Task from './Task';
import { EventEmitter } from 'events';

// https://twilio.github.io/twilio-taskrouter.js/Reservation.html

export default interface Reservation extends EventEmitter {
  accountSid: string;
  dateCreated: Date;
  dateUpdated: Date;
  sid: string;
  status: 'pending'|'accepted'|'rejected'|'timeout'|'canceled'|'rescinded'|'wrapping'|'completed';
  task: Task;
  task_transfer: undefined;
  timeout: number;
  workerSid: string;
  workspaceSid: string;
  accept: any;
  reject: any;
  call: any;
}