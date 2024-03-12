export interface Contact {
  key: string;
  name: string;
  notes: string;
  phoneNumber: string;
}

export interface HistoricalContact {
  taskSid: string;
  from?: string;
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
  customerName?: string;
  customerAddress?: string;
  twilioAddress?: string;
}

export interface Message {
  index: number;
  date: string;
  author: string;
  body: string;
}
