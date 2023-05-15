// https://twilio.github.io/twilio-taskrouter.js/OutgoingTransfer.html

export default interface OutgoingTransfer {
  dateCreated: Date;
  dateUpdated: Date;
  mode: 'WARM' | 'COLD';
  reservationSid: string;
  sid: string;
  status: 'INITIATED' | 'FAILED' | 'COMPLETED' | 'CANCELED';
  to: string;
  transferFailedReason: string;
  type: 'QUEUE' | 'WORKER';
  workerSid: string;
}
