import { EventEmitter } from 'events';

import { WorkerAttributes } from '@twilio/flex-ui';

import Activity from './Activity';
import Reservation from './Reservation';
import Channel from './Channel';

// https://twilio.github.io/twilio-taskrouter.js/Worker.html

export default interface Queue extends EventEmitter {
    name: string;
    sid: string;
    workspaceSid: string;
}