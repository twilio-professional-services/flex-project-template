import IncomingTransfer from './IncomingTransfer';
import OutgoingTransfer from './OutgoingTransfer';

// https://twilio.github.io/twilio-taskrouter.js/Task.html

export type TaskAssignmentStatus = 'reserved' | 'assigned' | 'canceled' | 'wrapping' | 'completed' | 'transferring';

export default interface Task {
  addOns: any;
  age: number;
  attributes: TaskAttributes;
  dateCreated: Date;
  dateUpdated: Date;
  incomingTransferDescriptor: null;
  outgoingTransferDescriptor: null;
  priority: number;
  queueName: string;
  queueSid: string;
  reason: string | null;
  reservationSid: string;
  routingTarget: null;
  sid: string;
  status: TaskAssignmentStatus;
  taskChannelSid: string;
  taskChannelUniqueName: string;
  timeout: number;
  transfers: {
    incoming?: IncomingTransfer;
    outgoing?: OutgoingTransfer;
  };
  workflowName: string;
  workflowSid: string;
}

export interface TaskAttributes {
  // Custom properties
  name?: string;
  accountNumber?: string;
  targetSkill?: string;
  priority?: string;
  autoClose?: boolean;
  parentTask?: string;
  taskType?: string;

  // feature-library/callback
  callBackData: {
    numberToCall?: string;
    numberToCallFrom?: string;
    attempts?: number;
    mainTimeZone?: string;
    utcDateTimeReceived?: string;
    recordingSid?: string;
    recordingUrl?: string;
    transcriptSid?: string;
    transcriptText?: string;
    isDeleted?: boolean;
  };

  // Flex Insights typically referenced elements
  conversations?: {
    conversation_id: string;
    destination?: string;
    hang_up_by?: string;
    outcome?: string;
    content?: string;
    conversation_attribute_1?: string;
    conversation_attribute_2?: string;
    conversation_attribute_3?: string;
    conversation_attribute_4?: string;
    conversation_attribute_5?: string;
    conversation_attribute_6?: string;
    conversation_attribute_7?: string;
    conversation_attribute_8?: string;
    conversation_attribute_9?: string;
    conversation_attribute_10?: string;
    conversation_label_1?: string;
    conversation_label_2?: string;
    conversation_label_3?: string;
    conversation_label_4?: string;
    conversation_label_5?: string;
    conversation_label_6?: string;
    conversation_label_8?: string;
    conversation_label_9?: string;
    conversation_label_10?: string;
    conversation_measure_1?: number;
    conversation_measure_2?: number;
    conversation_measure_3?: number;
    conversation_measure_4?: number;
    conversation_measure_5?: number;
    conversation_measure_6?: number;
    conversation_measure_7?: number;
    conversation_measure_8?: number;
    conversation_measure_9?: number;
    conversation_measure_10?: number;
  };

  // Task Router provided properties
  account_sid: string;
  api_version: string;
  call_sid: string;
  called: string;
  called_city: string;
  called_country: string;
  called_state: string;
  call_zip: string;
  caller: string;
  caller_city: string;
  caller_country: string;
  caller_state: string;
  caller_zip: string;
  conference: {
    sid: string;
    participants: { [participantType: string]: string };
    friendlyName: string;
  };
  direction?: string;
  from: string;
  from_city: string;
  from_country: string;
  from_state: string;
  from_zip: string;
  to: string;
  to_city: string;
  to_country: string;
  to_state: string;
  to_zip: string;
  type: string;
  outbound_to?: string;
}
