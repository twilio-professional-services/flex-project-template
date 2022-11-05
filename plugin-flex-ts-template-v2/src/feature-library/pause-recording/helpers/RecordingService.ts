import ApiService from '../../../utils/serverless/ApiService';
import { EncodedParams } from '../../../types/serverless';
import { FetchedRecording } from '../../../types/serverless/twilio-api';

export interface RecordingResponse {
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
  
      this.fetchJsonWithReject<RecordingResponse>(`${this.serverlessProtocol}://${this.serverlessDomain}/features/dual-channel-recording/flex/create-recording`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: this.buildBody(encodedParams)
        })
        .then((resp: RecordingResponse) => {
          resolve(resp.recording);
        })
        .catch(error => {
          console.log('Error starting dual channel recording', error);
          reject(error);
        });
    });
  }
  
  pauseCallRecording = async (callSid: string, pauseBehavior: string): Promise<FetchedRecording> => {
    return new Promise((resolve, reject) => {
      const encodedParams: EncodedParams = {
        callSid: encodeURIComponent(callSid),
        pauseBehavior: encodeURIComponent(pauseBehavior),
        Token: encodeURIComponent(this.manager.user.token)
      };
  
      this.fetchJsonWithReject<RecordingResponse>(`${this.serverlessProtocol}://${this.serverlessDomain}/features/pause-recording/flex/pause-call-recording`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: this.buildBody(encodedParams)
        })
        .then((resp: RecordingResponse) => {
          resolve(resp.recording);
        })
        .catch(error => {
          console.log('Error pausing recording', error);
          reject(error);
        });
    });
  }
  
  resumeCallRecording = async (callSid: string, recordingSid: string): Promise<FetchedRecording> => {
    return new Promise((resolve, reject) => {
      const encodedParams: EncodedParams = {
        callSid: encodeURIComponent(callSid),
        recordingSid: encodeURIComponent(recordingSid),
        Token: encodeURIComponent(this.manager.user.token)
      };
  
      this.fetchJsonWithReject<RecordingResponse>(`${this.serverlessProtocol}://${this.serverlessDomain}/features/pause-recording/flex/resume-call-recording`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: this.buildBody(encodedParams)
        })
        .then((resp: RecordingResponse) => {
          resolve(resp.recording);
        })
        .catch(error => {
          console.log('Error resuming recording', error);
          reject(error);
        });
    });
  }
  
  pauseConferenceRecording = async (conferenceSid: string, pauseBehavior: string): Promise<FetchedRecording> => {
    return new Promise((resolve, reject) => {
      const encodedParams: EncodedParams = {
        conferenceSid: encodeURIComponent(conferenceSid),
        pauseBehavior: encodeURIComponent(pauseBehavior),
        Token: encodeURIComponent(this.manager.user.token)
      };
  
      this.fetchJsonWithReject<RecordingResponse>(`${this.serverlessProtocol}://${this.serverlessDomain}/features/pause-recording/flex/pause-conference-recording`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: this.buildBody(encodedParams)
        })
        .then((resp: RecordingResponse) => {
          resolve(resp.recording);
        })
        .catch(error => {
          console.log('Error pausing recording', error);
          reject(error);
        });
    });
  }
  
  resumeConferenceRecording = async (conferenceSid: string, recordingSid: string): Promise<FetchedRecording> => {
    return new Promise((resolve, reject) => {
      const encodedParams: EncodedParams = {
        conferenceSid: encodeURIComponent(conferenceSid),
        recordingSid: encodeURIComponent(recordingSid),
        Token: encodeURIComponent(this.manager.user.token)
      };
  
      this.fetchJsonWithReject<RecordingResponse>(`${this.serverlessProtocol}://${this.serverlessDomain}/features/pause-recording/flex/resume-conference-recording`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: this.buildBody(encodedParams)
        })
        .then((resp: RecordingResponse) => {
          resolve(resp.recording);
        })
        .catch(error => {
          console.log('Error resuming recording', error);
          reject(error);
        });
    });
  }

}

export default new RecordingService();
