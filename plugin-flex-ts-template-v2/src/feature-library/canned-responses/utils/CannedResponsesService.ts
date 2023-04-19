import ApiService from '../../../utils/serverless/ApiService';
import { EncodedParams } from '../../../types/serverless';
import { CannedResponseCategories } from '../types/CannedResponses';

export interface CannedResponsesReponse {
  data: CannedResponseCategories;
}

class CannedResponsesService extends ApiService {
  fetchCannedResponses = async (): Promise<CannedResponsesReponse> => {
    return new Promise((resolve, reject) => {
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
