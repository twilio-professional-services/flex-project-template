export interface FetchedWorker {
  accountSid: string;
  activityName: string;
  activitySid: string;
  attributes: string;
  available: boolean;
  dateCreated: string;
  dateStatusChanged: string;
  dateUpdated: string;
  friendlyName: string;
  links: {
    activity: string;
    channels: string;
    cumulative_statistics: string;
    real_time_statistics: string;
    reservations: string;
    statistics: string;
    worker_channels: string;
    worker_statistics: string;
    workspace: string;
  };
  sid: string;
  url: string;
  workspaceSid: string;
}

export interface FetchedTask {
  accountSid: string;
  addons: string;
  age: number;
  assignmentStatus: string;
  attributes: string;
  dateCreated: string;
  dateUpdated: string;
  links: {
    reservations: string;
    task_queue: string;
    workflow: string;
    workspace: string;
  };
  priority: number;
  reason: string|null;
  sid: string;
  taskChannelSid: string;
  taskChannelUniqueName: string;
  taskQueueEnteredDate: string;
  taskQueueFriendlyName: string;
  taskQueueSid: string;
  timeout: number;
  url: string;
  workflowFriendlyName: string;
  workflowSid: string;
  workspaceSid: string;
}

export interface FetchedCall {
  accountSid: string;
  annotation: null;
  answeredBy: null;
  apiVersion: string;
  callerName: string;
  dateCreated: string;
  dateUpdated: string;
  direction: string;
  duration: null;
  endTime: null;
  forwardedFrom: null;
  from: string;
  fromFormatted: string;
  groupSid: null;
  parentCallSid: null;
  phoneNumberSid: string;
  price: null;
  priceUnit: string;
  queueTime: string;
  sid: string;
  startTime: string;
  status: string;
  subresourceUris: {
    notifications: string;
    recordings: string;
  };
  to: string;
  toFormatted: string;
  trunkSid: string;
  uri: string;
}

export interface FetchedConferenceParticipant {
  accountSid: string;
  callSid: string;
  callSidToCoach: null | string;
  coaching: boolean;
  conferenceSid: string;
  dateCreated: string;
  dateUpdated: string;
  endConferenceOnExit: boolean;
  hold: boolean;
  label: null | string;
  muted: boolean;
  startConferenceOnEnter: boolean;
  status: string;
  uri: string;
}

export interface FetchedRecording {
  accountSid: string;
  apiVersion: string;
  callSid: string;
  conferenceSid: null | string;
  dateCreated: string;
  dateUpdated: string;
  startTime: string;
  duration: null | string;
  sid: string;
  price: null | number;
  uri: string;
  encryptionDetails: null | object;
  priceUnit: null | string;
  status: string;
  channels: number;
  errorCode: null | number;
  track: string;
}