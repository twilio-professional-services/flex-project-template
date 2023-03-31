import ApiService from '../../../utils/serverless/ApiService';
import { EncodedParams } from '../../../types/serverless';
import { FetchedConferenceParticipant } from '../../../types/serverless/twilio-api';

export interface ParticipantResponse {
  success: boolean;
  participantsResponse: FetchedConferenceParticipant;
}

class HangUpByService extends ApiService {
  fetchParticipant = async (conferenceSid: string, participantSid: string): Promise<ParticipantResponse> => {
    return new Promise((resolve, reject) => {
      const encodedParams: EncodedParams = {
        conference: encodeURIComponent(conferenceSid),
        participant: encodeURIComponent(participantSid),
        Token: encodeURIComponent(this.manager.store.getState().flex.session.ssoTokenPayload.token),
      };

      this.fetchJsonWithReject<ParticipantResponse>(
        `${this.serverlessProtocol}://${this.serverlessDomain}/features/hang-up-by/flex/fetch-conference-participant`,
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
          console.error(`Error fetching participant ${participantSid} from conference\r\n`, error);
          reject(error);
        });
    });
  };
}

export default new HangUpByService();
