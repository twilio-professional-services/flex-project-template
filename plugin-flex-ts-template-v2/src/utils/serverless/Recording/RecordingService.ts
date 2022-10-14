import ApiService from '../ApiService';
import { EncodedParams } from '../../../types/serverless';
import { FetchedRecording } from '../../../types/serverless/twilio-api';

export interface CreateRecordingResponse {
  success: boolean;
  recording: FetchedRecording;
}

class RecordingService extends ApiService {

  startDualChannelRecording = async (callSid: string): Promise<FetchedRecording> => {
    return new Promise((resolve, reject) => {
      const encodedParams: EncodedParams = {
        callSid: encodeURIComponent(callSid),
        Token: encodeURIComponent(this.manager.user.token)
      };
  
      this.fetchJsonWithReject<CreateRecordingResponse>(`https://${this.serverlessDomain}/features/dual-channel-recording/flex/create-recording`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: this.buildBody(encodedParams)
        })
        .then((resp: CreateRecordingResponse) => {
          resolve(resp.recording);
        })
        .catch(error => {
          console.log('Error starting dual channel recording', error);
          reject(error);
        });
    });
  }

}

export default new RecordingService();