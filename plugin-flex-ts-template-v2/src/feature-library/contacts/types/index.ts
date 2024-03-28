export interface Contact {
  key: string;
  name: string;
  notes: string;
  phoneNumber: string;
}

export interface HistoricalContact {
  taskSid: string;
  direction: string | undefined;
  channelType?: string;
  customerAddress?: string;
  inboundAddress?: string;
  name?: string;
  dateTime: string;
  duration: number;
  queueName: string;
  outcome?: string;
  notes?: string;
}

export interface Message {
  index: number;
  date: string;
  author: string;
  body: string;
}
