import ApiService from '../../../utils/serverless/ApiService';
import { EncodedParams } from '../../../types/serverless';
import { CannedResponseCategories } from '../types/CannedResponses';
import logger from '../../../utils/logger';

export interface CannedResponsesReponse {
  data: CannedResponseCategories;
}

class CannedResponsesService extends ApiService {
  cannedResponseCache: CannedResponsesReponse | null = null;

  fetchCannedResponses = async (): Promise<CannedResponsesReponse> => {
    if (this.cannedResponseCache) {
      return this.cannedResponseCache;
    }

    const encodedParams: EncodedParams = {
      Token: encodeURIComponent(this.manager.user.token),
    };

    try {
      const response = await this.fetchJsonWithReject<CannedResponsesReponse>(
        `${this.serverlessProtocol}://${this.serverlessDomain}/features/canned-responses/flex/chat-responses`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: this.buildBody(encodedParams),
        },
      );
      this.cannedResponseCache = response;
      return response;
    } catch (error: any) {
      logger.error(`[canned-responses] Error fetching canned responses\r\n`, error);
      throw error;
    }
  };
}

export default new CannedResponsesService();
