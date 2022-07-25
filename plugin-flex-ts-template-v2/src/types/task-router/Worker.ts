import { WorkerAttributes } from '@twilio/flex-ui';
import { EventEmitter } from 'events';
import Activity from './Activity';
import Reservation from './Reservation';
import Channel from './Channel';

// https://twilio.github.io/twilio-taskrouter.js/Worker.html

export default interface Worker extends EventEmitter {
  accountSid: string;
  activities: Map<string, Activity>;
  activity: Activity;
  attributes: CustomWorkerAttributes;
  channels: Map<string, Channel>;
  connectActivitySid: string;
  dateCreated: Date;
  dateStatusChanged: Date;
  dateChanged: Date;
  name: string;
  reservations: Map<string, Reservation>;
  sid: string;
  workspaceSid: string;
}

export interface CustomWorkerAttributes extends WorkerAttributes {
  SID: string;
  contact_uri: string;
  image_url: string;
  roles: ['admin' | 'supervisor' | 'agent'];

  // used to override name seen on webchat
  public_identity: string;

  //caller-id feature
  selectedCallerId: string;

  // Flex insights references the following elements
  email: string;
  full_name: string;
  location?: string;
  manager?: string;
  team_id?: string;
  team_name?: string;
  department_id?: string;
  department_name?: string;
}
