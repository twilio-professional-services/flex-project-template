/* Created for use with external transfer extensions

  merged from excellent work done by Terence Rogers
  https://github.com/trogers-twilio/plugin-external-conference-warm-transfer

*/
import { ConferenceParticipant } from '@twilio/flex-ui';
import ApiService from '../../../utils/serverless/ApiService';
import { EncodedParams } from '../../../types/serverless';
import { FetchedCall, FetchedConferenceParticipant } from '../../../types/serverless/twilio-api';
import { ParticipantBase, ParticipantTypes, VoiceProperties } from '@twilio/flex-ui/src/state/Participants/participants.types';

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

class ConferenceService extends ApiService {

  _toggleParticipantHold = async (conference: string, participantSid: string, hold: boolean): Promise<string> => {
    return new Promise((resolve, reject) => {

      const encodedParams: EncodedParams = {
        conference: encodeURIComponent(conference),
        participant: encodeURIComponent(participantSid),
        hold: encodeURIComponent(hold),
        Token: encodeURIComponent(this.manager.user.token)
      }

      this.fetchJsonWithReject<ParticipantResponse>(`${this.serverlessProtocol}://${this.serverlessDomain}/common/flex/programmable-voice/hold-participant`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: this.buildBody(encodedParams)
        })
        .then((response: ParticipantResponse) => {
          console.log(`${hold ? 'Hold' : 'Unhold'} successful for participant`, participantSid);
          resolve(response.participantsResponse.callSid);
        })
        .catch(error => {
          console.error(`Error ${hold ? 'holding' : 'unholding'} participant ${participantSid}\r\n`, error);
          reject(error);
        })

    });

  }

  setEndConferenceOnExit = async (conference: string, participantSid: string, endConferenceOnExit: boolean): Promise<string> => {
    return new Promise((resolve, reject) => {

      const encodedParams: EncodedParams = {
        conference: encodeURIComponent(conference),
        participant: encodeURIComponent(participantSid),
        endConferenceOnExit: encodeURIComponent(endConferenceOnExit),
        Token: encodeURIComponent(this.manager.user.token)
      }

      this.fetchJsonWithReject<ParticipantResponse>(`${this.serverlessProtocol}://${this.serverlessDomain}/common/flex/programmable-voice/update-participant`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: this.buildBody(encodedParams)
        }).then((response: ParticipantResponse) => {
          console.log(`Participant ${participantSid} updated:\r\n`, response);
          resolve(response.participantsResponse.callSid);
        })
        .catch(error => {
          console.error(`Error updating participant ${participantSid}\r\n`, error);
          reject(error);
        });

    });
  }

  addParticipant = async (taskSid: string, from: string, to: string): Promise<string> => {
    return new Promise((resolve, reject) => {

      const encodedParams: EncodedParams = {
        taskSid: encodeURIComponent(taskSid),
        from: encodeURIComponent(from),
        to: encodeURIComponent(to),
        Token: encodeURIComponent(this.manager.user.token)
      };

      this.fetchJsonWithReject<ParticipantResponse>(`${this.serverlessProtocol}://${this.serverlessDomain}/common/flex/programmable-voice/add-participant`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: this.buildBody(encodedParams)
        })
        .then((response: ParticipantResponse) => {
          console.log('Participant added:\r\n  ', response);
          resolve(response.participantsResponse.callSid);
        })
        .catch(error => {
          console.log('There is an error while adding participan', error);
          reject(error);
        });
    })
  }

  holdParticipant = (conference: string, participantSid: string): Promise<string> => {
    return this._toggleParticipantHold(conference, participantSid, true);
  }

  unholdParticipant = (conference: string, participantSid: string): Promise<string> => {
    return this._toggleParticipantHold(conference, participantSid, false);
  }

  removeParticipant = (conference: string, participantSid: string): Promise<string> => {
    return new Promise((resolve, reject) => {

      const encodedParams: EncodedParams = {
        conference: encodeURIComponent(conference),
        participant: encodeURIComponent(participantSid),
        Token: encodeURIComponent(this.manager.user.token)
      };

      this.fetchJsonWithReject<RemoveParticipantResponse>(`${this.serverlessProtocol}://${this.serverlessDomain}/common/flex/programmable-voice/remove-participant`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: this.buildBody(encodedParams)
        })
        .then((response: RemoveParticipantResponse) => {
          console.log(`Participant ${participantSid} removed from conference`);
          resolve(participantSid);
        })
        .catch(error => {
          console.error(`Error removing participant ${participantSid} from conference\r\n`, error);
          reject(error);
        });

    });
  }

  getCallProperties = async (callSid: string): Promise<FetchedCall> => {
    return new Promise((resolve, reject) => {
      const encodedParams: EncodedParams = {
        callSid: encodeURIComponent(callSid),
        Token: encodeURIComponent(this.manager.user.token)
      };
  
      this.fetchJsonWithReject<GetCallResponse>(`${this.serverlessProtocol}://${this.serverlessDomain}/common/flex/programmable-voice/get-call-properties`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: this.buildBody(encodedParams)
        })
        .then((resp: GetCallResponse) => {
          console.log('The call properties are', resp.callProperties);
          resolve(resp.callProperties);
        })
        .catch(error => {
          console.log('There is an error', error);
          reject(error);
        });
    });
  }

}

export default new ConferenceService();
