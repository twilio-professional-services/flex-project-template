import ApiService from '../../../utils/serverless/ApiService';
import { EncodedParams } from '../../../types/serverless';
import { FetchedRecording } from '../../../types/serverless/twilio-api';

export interface RecordingResponse {
  success: boolean;
  recording: FetchedRecording;
}

class DualChannelService extends ApiService {
  startDualChannelRecording = async (callSid: string): Promise<FetchedRecording> => {
    return new Promise((resolve, reject) => {
      const encodedParams: EncodedParams = {
        callSid: encodeURIComponent(callSid),
        Token: encodeURIComponent(this.manager.user.token),
      };

      this.fetchJsonWithReject<RecordingResponse>(
        `${this.serverlessProtocol}://${this.serverlessDomain}/features/dual-channel-recording/flex/create-recording`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: this.buildBody(encodedParams),
        },
      )
        .then((resp: RecordingResponse) => {
          resolve(resp.recording);
        })
        .catch((error) => {
          console.log('Error starting dual channel recording', error);
          reject(error);
        });
    });
  };
}

export default new DualChannelService();
