import ApiService from '../../../utils/serverless/ApiService';
import { EncodedParams } from '../../../types/serverless';
import { FetchedRecording } from '../../../types/serverless/twilio-api';

export interface UnparkInteractionResponse {
  success: boolean;
  recording: FetchedRecording;
}

class UnparkInteractionService extends ApiService {
  unparkInteraction = async (ConversationSid: string, WebhookSid: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      const encodedParams: EncodedParams = {
        ConversationSid: encodeURIComponent(ConversationSid),
        WebhookSid: encodeURIComponent(WebhookSid),
      };

      this.fetchJsonWithReject<any>(
        `${this.serverlessProtocol}://${this.serverlessDomain}/features/park-interaction/common/unpark-interaction`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: this.buildBody(encodedParams),
        },
      )
        .then((resp: any) => {
          resolve(resp.recording);
        })
        .catch((error) => {
          console.log('Error unparking interaction', error);
          reject(error);
        });
    });
  };
}

export default new UnparkInteractionService();
