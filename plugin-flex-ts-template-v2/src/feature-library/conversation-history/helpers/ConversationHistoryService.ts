import ApiService from '../../../utils/serverless/ApiService';
import { EncodedParams } from '../../../types/serverless';
import logger from '../../../utils/logger';
import ParticipantConversation from '../types/ParticipantConversation';

export interface HistoryResponse {
  success: boolean;
  conversations: ParticipantConversation[];
}

class ConversationHistoryService extends ApiService {
  getConversationHistory = async (address: string): Promise<HistoryResponse> => {
    const encodedParams: EncodedParams = {
      address: encodeURIComponent(address),
      Token: encodeURIComponent(this.manager.user.token),
    };

    try {
      const response = await this.fetchJsonWithReject<HistoryResponse>(
        `${this.serverlessProtocol}://${this.serverlessDomain}/features/conversation-history/flex/get-conversation-history`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: this.buildBody(encodedParams),
        },
      );
      return response;
    } catch (error: any) {
      logger.error('[conversation-history] Error retrieving conversation history', error);
      throw error;
    }
  };
}

export default new ConversationHistoryService();
