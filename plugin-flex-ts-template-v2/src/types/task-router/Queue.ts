import { EventEmitter } from 'events';

// https://twilio.github.io/twilio-taskrouter.js/TaskQueue.html

export default interface Queue extends EventEmitter {
  name: string;
  sid: string;
  workspaceSid: string;
}
