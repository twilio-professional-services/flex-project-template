// https://twilio.github.io/twilio-taskrouter.js/IncomingTransfer.html

export default interface IncomingTransfer {
  dateCreated: Date;
  dateUpdated: Date;
  mode: 'WARM' | 'COLD';
  reservationSid: string;
  sid: string;
  status: 'INITIATED' | 'FAILED' | 'COMPLETED' | 'CANCELED';
  to: string;
  type: 'QUEUE' | 'WORKER';
  workerSid: string;
}
