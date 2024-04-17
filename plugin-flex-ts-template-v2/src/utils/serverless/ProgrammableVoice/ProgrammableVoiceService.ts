/* Created for use with external transfer extensions

  merged from excellent work done by Terence Rogers
  https://github.com/trogers-twilio/plugin-external-conference-warm-transfer

*/

import ApiService from '../ApiService';
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

export interface GenericSuccessResponse {
  success: boolean;
}

class ProgrammableVoiceService extends ApiService {
  #holdUrl = '';

  get holdUrl(): string {
    return this.#holdUrl;
  }

  set holdUrl(holdUrl: string) {
    if (Boolean(this.#holdUrl)) {
      console.warn('[ProgrammableVoiceService] holdUrl is being overwritten.');
    }
    this.#holdUrl = holdUrl;
  }

  startColdTransfer = async (callSid: string, to: string, from?: string): Promise<boolean> => {
    const { success } = await this._startColdTransfer(callSid, to, from);
    return success;
  };

  _startColdTransfer = async (callSid: string, to: string, from?: string): Promise<any> => {
    const encodedParams: EncodedParams = {
      Token: encodeURIComponent(this.manager.user.token),
      callSid: encodeURIComponent(callSid),
      to: encodeURIComponent(to),
      from: from ? encodeURIComponent(from) : '',
    };

    return this.fetchJsonWithReject<GenericSuccessResponse>(
      `${this.serverlessProtocol}://${this.serverlessDomain}/common/flex/programmable-voice/cold-transfer`,
      {
        method: 'post',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: this.buildBody(encodedParams),
      },
    );
  };

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

  setEndConferenceOnExit = async (
    conference: string,
    participantSid: string,
    endConferenceOnExit: boolean,
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const encodedParams: EncodedParams = {
        conference: encodeURIComponent(conference),
        participant: encodeURIComponent(participantSid),
        endConferenceOnExit: encodeURIComponent(endConferenceOnExit),
        Token: encodeURIComponent(this.manager.user.token),
      };

      this.fetchJsonWithReject<ParticipantResponse>(
        `${this.serverlessProtocol}://${this.serverlessDomain}/common/flex/programmable-voice/update-participant`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: this.buildBody(encodedParams),
        },
      )
        .then((response: ParticipantResponse) => {
          console.log(`Participant ${participantSid} updated:\r\n`, response);
          resolve(response.participantsResponse.callSid);
        })
        .catch((error) => {
          console.error(`Error updating participant ${participantSid}\r\n`, error);
          reject(error);
        });
    });
  };

  addParticipant = async (taskSid: string, from: string, to: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const encodedParams: EncodedParams = {
        taskSid: encodeURIComponent(taskSid),
        from: encodeURIComponent(from),
        to: encodeURIComponent(to),
        Token: encodeURIComponent(this.manager.user.token),
      };

      this.fetchJsonWithReject<ParticipantResponse>(
        `${this.serverlessProtocol}://${this.serverlessDomain}/common/flex/programmable-voice/add-participant`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: this.buildBody(encodedParams),
        },
      )
        .then((response: ParticipantResponse) => {
          console.log('Participant added:\r\n  ', response);
          resolve(response.participantsResponse.callSid);
        })
        .catch((error) => {
          console.log('There is an error while adding participan', error);
          reject(error);
        });
    });
  };

  _toggleParticipantHold = async (conference: string, participantSid: string, hold: boolean): Promise<string> => {
    return new Promise((resolve, reject) => {
      const encodedParams: EncodedParams = {
        conference: encodeURIComponent(conference),
        participant: encodeURIComponent(participantSid),
        hold: encodeURIComponent(hold),
        Token: encodeURIComponent(this.manager.user.token),
      };

      if (hold && this.holdUrl) {
        encodedParams.holdUrl = encodeURIComponent(this.holdUrl);
      }

      this.fetchJsonWithReject<ParticipantResponse>(
        `${this.serverlessProtocol}://${this.serverlessDomain}/common/flex/programmable-voice/hold-participant`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: this.buildBody(encodedParams),
        },
      )
        .then((response: ParticipantResponse) => {
          console.log(`${hold ? 'Hold' : 'Unhold'} successful for participant`, participantSid);
          resolve(response.participantsResponse.callSid);
        })
        .catch((error) => {
          console.error(`Error ${hold ? 'holding' : 'unholding'} participant ${participantSid}\r\n`, error);
          reject(error);
        });
    });
  };

  holdParticipant = async (conference: string, participantSid: string): Promise<string> => {
    return this._toggleParticipantHold(conference, participantSid, true);
  };

  unholdParticipant = async (conference: string, participantSid: string): Promise<string> => {
    return this._toggleParticipantHold(conference, participantSid, false);
  };

  removeParticipant = async (conference: string, participantSid: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const encodedParams: EncodedParams = {
        conference: encodeURIComponent(conference),
        participant: encodeURIComponent(participantSid),
        Token: encodeURIComponent(this.manager.user.token),
      };

      this.fetchJsonWithReject<GenericSuccessResponse>(
        `${this.serverlessProtocol}://${this.serverlessDomain}/common/flex/programmable-voice/remove-participant`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: this.buildBody(encodedParams),
        },
      )
        .then((_response: GenericSuccessResponse) => {
          console.log(`Participant ${participantSid} removed from conference`);
          resolve(participantSid);
        })
        .catch((error) => {
          console.error(`Error removing participant ${participantSid} from conference\r\n`, error);
          reject(error);
        });
    });
  };

  getCallProperties = async (callSid: string): Promise<FetchedCall> => {
    return new Promise((resolve, reject) => {
      const encodedParams: EncodedParams = {
        callSid: encodeURIComponent(callSid),
        Token: encodeURIComponent(this.manager.user.token),
      };

      this.fetchJsonWithReject<GetCallResponse>(
        `${this.serverlessProtocol}://${this.serverlessDomain}/common/flex/programmable-voice/get-call-properties`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: this.buildBody(encodedParams),
        },
      )
        .then((resp: GetCallResponse) => {
          console.log('The call properties are', resp.callProperties);
          resolve(resp.callProperties);
        })
        .catch((error) => {
          console.log('There is an error', error);
          reject(error);
        });
    });
  };
}

export default new ProgrammableVoiceService();
