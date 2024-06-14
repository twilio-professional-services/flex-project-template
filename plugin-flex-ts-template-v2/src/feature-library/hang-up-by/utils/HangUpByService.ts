import ApiService from '../../../utils/serverless/ApiService';
import { EncodedParams } from '../../../types/serverless';
import { FetchedConferenceParticipant } from '../../../types/serverless/twilio-api';
import logger from '../../../utils/logger';

export interface ParticipantResponse {
  success: boolean;
  participantsResponse: FetchedConferenceParticipant;
}

class HangUpByService extends ApiService {
  fetchParticipant = async (conferenceSid: string, participantSid: string): Promise<ParticipantResponse> => {
    const encodedParams: EncodedParams = {
      conference: encodeURIComponent(conferenceSid),
      participant: encodeURIComponent(participantSid),
      Token: encodeURIComponent(this.manager.user.token),
    };

    try {
      return await this.fetchJsonWithReject<ParticipantResponse>(
        `${this.serverlessProtocol}://${this.serverlessDomain}/features/hang-up-by/flex/fetch-conference-participant`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: this.buildBody(encodedParams),
        },
      );
    } catch (error: any) {
      logger.error(`[hang-up-by] Error fetching participant ${participantSid} from conference\r\n`, error);
      throw error;
    }
  };
}

export default new HangUpByService();
