/* Created for use with sip-mute feature

  Based on the amazing work done by John Lafer
  https://github.com/jlafer/plugin-station-selector

  Ported to PS Plugin by Chris Connolly
*/

import ApiService from '../../../utils/serverless/ApiService';
import { EncodedParams } from '../../../types/serverless';
import { FetchedCall, FetchedConferenceParticipant } from '../../../types/serverless/twilio-api';

export interface GetCallResponse {
  success: boolean;
  callProperties: FetchedCall;
}

export interface ParticipantResponse {
  success: boolean;
  participantsResponse: FetchedConferenceParticipant;
}

export interface RemoveParticipantResponse {
  success: boolean;
}

class CallControlService extends ApiService {
  _toggleMuteParticipant = async (conferenceSid: string, participantSid: string, muted: boolean): Promise<string> => {
    return new Promise((resolve, reject) => {
      const encodedParams: EncodedParams = {
        conference: encodeURIComponent(conferenceSid),
        participant: encodeURIComponent(participantSid),
        muted: encodeURIComponent(muted),
        Token: encodeURIComponent(this.manager.user.token),
      };

      this.fetchJsonWithReject<ParticipantResponse>(
        `${this.serverlessProtocol}://${this.serverlessDomain}/common/flex/programmable-voice/mute-participant`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: this.buildBody(encodedParams),
        },
      )
        .then((response: ParticipantResponse) => {
          console.log(`${muted ? 'Muted' : 'Unmuted'} successful for participant`, participantSid);
          resolve(response.participantsResponse.callSid);
        })
        .catch((error) => {
          console.error(`Error ${muted ? 'muting' : 'un-muting'} participant ${participantSid}\r\n`, error);
          reject(error);
        });
    });
  };

  muteParticipant = async (conference: string, participantSid: string): Promise<string> => {
    return this._toggleMuteParticipant(conference, participantSid, true);
  };

  unmuteParticipant = async (conference: string, participantSid: string): Promise<string> => {
    return this._toggleMuteParticipant(conference, participantSid, false);
  };

  // NOTE:
  // This duplicates code from the 'conference' feature in the PS template,
  // It is included here so it can be a stand alone feature
  removeParticipant = async (conference: string, participantSid: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const encodedParams: EncodedParams = {
        conference: encodeURIComponent(conference),
        participant: encodeURIComponent(participantSid),
        Token: encodeURIComponent(this.manager.user.token),
      };

      this.fetchJsonWithReject<RemoveParticipantResponse>(
        `${this.serverlessProtocol}://${this.serverlessDomain}/common/flex/programmable-voice/remove-participant`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: this.buildBody(encodedParams),
        },
      )
        .then((_response: RemoveParticipantResponse) => {
          console.log(`Participant ${participantSid} removed from conference`);
          resolve(participantSid);
        })
        .catch((error) => {
          console.error(`Error removing participant ${participantSid} from conference\r\n`, error);
          reject(error);
        });
    });
  };
}

export default new CallControlService();
