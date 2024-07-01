import ApiService from '../../../utils/serverless/ApiService';
import { EncodedParams } from '../../../types/serverless';
import { FetchedRecording } from '../../../types/serverless/twilio-api';
import logger from '../../../utils/logger';

export interface RecordingResponse {
  success: boolean;
  recording: FetchedRecording;
}

class PauseRecordingService extends ApiService {
  pauseCallRecording = async (callSid: string, pauseBehavior: string): Promise<FetchedRecording> => {
    const encodedParams: EncodedParams = {
      callSid: encodeURIComponent(callSid),
      pauseBehavior: encodeURIComponent(pauseBehavior),
      Token: encodeURIComponent(this.manager.user.token),
    };

    try {
      const { recording } = await this.fetchJsonWithReject<RecordingResponse>(
        `${this.serverlessProtocol}://${this.serverlessDomain}/features/pause-recording/flex/pause-call-recording`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: this.buildBody(encodedParams),
        },
      );
      return recording;
    } catch (error: any) {
      logger.error('[pause-recording] Error pausing recording', error);
      throw error;
    }
  };

  resumeCallRecording = async (callSid: string, recordingSid: string): Promise<FetchedRecording> => {
    const encodedParams: EncodedParams = {
      callSid: encodeURIComponent(callSid),
      recordingSid: encodeURIComponent(recordingSid),
      Token: encodeURIComponent(this.manager.user.token),
    };

    try {
      const { recording } = await this.fetchJsonWithReject<RecordingResponse>(
        `${this.serverlessProtocol}://${this.serverlessDomain}/features/pause-recording/flex/resume-call-recording`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: this.buildBody(encodedParams),
        },
      );
      return recording;
    } catch (error: any) {
      logger.error('[pause-recording] Error resuming recording', error);
      throw error;
    }
  };

  pauseConferenceRecording = async (conferenceSid: string, pauseBehavior: string): Promise<FetchedRecording> => {
    const encodedParams: EncodedParams = {
      conferenceSid: encodeURIComponent(conferenceSid),
      pauseBehavior: encodeURIComponent(pauseBehavior),
      Token: encodeURIComponent(this.manager.user.token),
    };

    try {
      const { recording } = await this.fetchJsonWithReject<RecordingResponse>(
        `${this.serverlessProtocol}://${this.serverlessDomain}/features/pause-recording/flex/pause-conference-recording`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: this.buildBody(encodedParams),
        },
      );
      return recording;
    } catch (error: any) {
      logger.error('[pause-recording] Error pausing recording', error);
      throw error;
    }
  };

  resumeConferenceRecording = async (conferenceSid: string, recordingSid: string): Promise<FetchedRecording> => {
    const encodedParams: EncodedParams = {
      conferenceSid: encodeURIComponent(conferenceSid),
      recordingSid: encodeURIComponent(recordingSid),
      Token: encodeURIComponent(this.manager.user.token),
    };

    try {
      const { recording } = await this.fetchJsonWithReject<RecordingResponse>(
        `${this.serverlessProtocol}://${this.serverlessDomain}/features/pause-recording/flex/resume-conference-recording`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: this.buildBody(encodedParams),
        },
      );
      return recording;
    } catch (error: any) {
      logger.error('[pause-recording] Error resuming recording', error);
      throw error;
    }
  };
}

export default new PauseRecordingService();
