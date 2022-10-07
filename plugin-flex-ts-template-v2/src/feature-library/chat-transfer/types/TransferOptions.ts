import * as Flex from "@twilio/flex-ui";

export interface TransferOptions {
  attributes: string;
  mode: string;
  priority: string;
}

export interface EventPayload {
  task: Flex.ITask;
  sid?: string; // taskSid or task is required
  targetSid: string; // target of worker or queue sid
  options?: TransferOptions;
}
