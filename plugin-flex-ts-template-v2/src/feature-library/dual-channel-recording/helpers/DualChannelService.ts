import ApiService from '../../../utils/serverless/ApiService';
import { EncodedParams } from '../../../types/serverless';
import { FetchedRecording } from '../../../types/serverless/twilio-api';
import logger from '../../../utils/logger';

export interface RecordingResponse {
  success: boolean;
  recording: FetchedRecording;
}

class DualChannelService extends ApiService {
  startDualChannelRecording = async (callSid: string): Promise<FetchedRecording> => {
    const encodedParams: EncodedParams = {
      callSid: encodeURIComponent(callSid),
      Token: encodeURIComponent(this.manager.user.token),
    };
    try {
      const { recording } = await this.fetchJsonWithReject<RecordingResponse>(
        `${this.serverlessProtocol}://${this.serverlessDomain}/features/dual-channel-recording/flex/create-recording`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: this.buildBody(encodedParams),
        },
      );
      return recording;
    } catch (error: any) {
      logger.error('[dual-channel-recording] Error starting dual channel recording', error);
      throw error;
    }
  };
}

export default new DualChannelService();
