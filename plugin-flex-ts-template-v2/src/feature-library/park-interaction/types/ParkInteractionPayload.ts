import { ITask } from '@twilio/flex-ui';

export default interface ParkInteractionPayload {
  task: ITask;
}
export interface UnparkInteractionPayload {
  ConversationSid: string;
  WebhookSid: string;
}
