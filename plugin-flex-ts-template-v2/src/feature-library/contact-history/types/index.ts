export interface Contact {
  taskSid: string;
  direction: string | undefined;
  call_sid?: string;
  channel: string;
  channelType?: string;
  phoneNumber?: string;
  twilioPhoneNumber?: string;
  name?: string;
  dateTime: string;
  duration: number;
  queueName: string;
  conversationSid?: string;
  outcome?: string;
  notes?: string;
  segmentLink?: string;
  workerCallSid?: string;
  customerCallSid?: string;
}

export interface Message {
  index: number;
  date: string;
  author: string;
  body: string;
}
