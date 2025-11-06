import ApiService from '../../../utils/serverless/ApiService';
import { EncodedParams } from '../../../types/serverless';
import { isListEnabled } from '../config';
import logger from '../../../utils/logger';

export interface ParkInteractionResponse {
  success: boolean;
}

export interface ParkedInteraction {
  channelSid: string;
  interactionSid: string;
  participantSid: string;
  conversationSid: string;
  channelType: string;
  taskSid: string;
  workflowSid: string;
  taskChannelUniqueName: string;
  queueName: string;
  queueSid: string;
  taskAttributes: CustomTask;
  workerSid: string;
  webhookSid: string;
}

interface CustomTask {
  customers: Customers;
  from: string;
}

interface Customers {
  phone?: string;
  email?: string;
}

interface UnparkInteractionResponse {
  success: boolean;
}

class ParkInteractionService extends ApiService {
  parkInteraction = async (
    channelSid: string,
    interactionSid: string,
    participantSid: string,
    conversationSid: string,
    channelType: string,
    taskSid: string,
    workflowSid: string,
    taskChannelUniqueName: string,
    queueName: string,
    queueSid: string,
    taskAttributes: string,
  ): Promise<ParkInteractionResponse> => {
    const encodedParams: EncodedParams = {
      channelSid: encodeURIComponent(channelSid),
      interactionSid: encodeURIComponent(interactionSid),
      participantSid: encodeURIComponent(participantSid),
      conversationSid: encodeURIComponent(conversationSid),
      channelType: encodeURIComponent(channelType),
      taskSid: encodeURIComponent(taskSid),
      workflowSid: encodeURIComponent(workflowSid),
      taskChannelUniqueName: encodeURIComponent(taskChannelUniqueName),
      queueName: encodeURIComponent(queueName),
      queueSid: encodeURIComponent(queueSid),
      taskAttributes: encodeURIComponent(taskAttributes),
      workerSid: encodeURIComponent(this.manager.store.getState().flex.worker.worker?.sid ?? ''),
      createUpdateSyncMapItem: encodeURIComponent(isListEnabled()),
      Token: encodeURIComponent(this.manager.user.token),
    };
    try {
      return await this.fetchJsonWithReject<ParkInteractionResponse>(
        `${this.serverlessProtocol}://${this.serverlessDomain}/features/park-interaction/flex/park-interaction`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: this.buildBody(encodedParams),
        },
      );
    } catch (error: any) {
      logger.error('[park-interaction] Error parking interaction', error);
      throw error;
    }
  };

  unparkInteraction = async (ConversationSid: string, WebhookSid: string): Promise<UnparkInteractionResponse> => {
    const encodedParams: EncodedParams = {
      ConversationSid: encodeURIComponent(ConversationSid),
      WebhookSid: encodeURIComponent(WebhookSid),
      RouteToSameWorker: encodeURIComponent(true),
      Token: encodeURIComponent(this.manager.user.token),
    };
    try {
      return await this.fetchJsonWithReject<UnparkInteractionResponse>(
        `${this.serverlessProtocol}://${this.serverlessDomain}/features/park-interaction/flex/unpark-interaction`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: this.buildBody(encodedParams),
        },
      );
    } catch (error: any) {
      logger.error('[park-interaction] Error unparking interaction', error);
      throw error;
    }
  };
}

export default new ParkInteractionService();
