import ApiService from '../../../utils/serverless/ApiService';
import { EncodedParams } from '../../../types/serverless';
import { CannedResponseCategories } from '../types/CannedResponses';

export interface CannedResponsesReponse {
  data: CannedResponseCategories;
}

class CannedResponsesService extends ApiService {
  cannedResponseCache: CannedResponsesReponse | null = null;

  fetchCannedResponses = async (): Promise<CannedResponsesReponse> => {
    return new Promise((resolve, reject) => {
      if (this.cannedResponseCache) {
        resolve(this.cannedResponseCache);
        return;
      }

      const encodedParams: EncodedParams = {
        Token: encodeURIComponent(this.manager.store.getState().flex.session.ssoTokenPayload.token),
      };

      this.fetchJsonWithReject<CannedResponsesReponse>(
        `${this.serverlessProtocol}://${this.serverlessDomain}/features/canned-responses/flex/chat-responses`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: this.buildBody(encodedParams),
        },
      )
        .then((response) => {
          this.cannedResponseCache = response;
          resolve(response);
        })
        .catch((error) => {
          console.error(`Error fetching canned responses\r\n`, error);
          reject(error);
        });
    });
  };
}

export default new CannedResponsesService();
