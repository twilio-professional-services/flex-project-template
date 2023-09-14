import ApiService from '../../../utils/serverless/ApiService';
import { EncodedParams } from '../../../types/serverless';

export interface AdminUiServiceReponse {
  configuration: any;
}

class AdminUiService extends ApiService {
  fetchUiAttributes = async (): Promise<AdminUiServiceReponse> => {
    return new Promise((resolve, reject) => {
      const encodedParams: EncodedParams = {
        Token: encodeURIComponent(this.manager.store.getState().flex.session.ssoTokenPayload.token),
      };

      this.fetchJsonWithReject<AdminUiServiceReponse>(
        `${this.serverlessProtocol}://${this.serverlessDomain}/features/admin-ui/flex/fetch-config`,
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
          console.error(`Error fetching configuration\r\n`, error);
          reject(error);
        });
    });
  };

  updateUiAttributes = async (attributesUpdate: string, mergeFeature: boolean): Promise<AdminUiServiceReponse> => {
    return new Promise((resolve, reject) => {
      const encodedParams: EncodedParams = {
        Token: encodeURIComponent(this.manager.store.getState().flex.session.ssoTokenPayload.token),
        attributesUpdate: encodeURIComponent(attributesUpdate),
        mergeFeature: encodeURIComponent(mergeFeature),
      };

      this.fetchJsonWithReject<AdminUiServiceReponse>(
        `${this.serverlessProtocol}://${this.serverlessDomain}/features/admin-ui/flex/update-config`,
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
          console.error(`Error updating configuration\r\n`, error);
          reject(error);
        });
    });
  };
}

export default new AdminUiService();
