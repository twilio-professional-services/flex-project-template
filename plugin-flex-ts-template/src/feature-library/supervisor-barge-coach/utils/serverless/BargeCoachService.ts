import * as Flex from '@twilio/flex-ui';

import { EncodedParams } from '../../../../types/serverless';
import ApiService from '../../../../utils/serverless/ApiService';

export interface ParticipantMuteCoach {
  success: boolean,
  conferenceSid: string,
  participantSid: string,
  agentSid: string,
  muted: boolean,
  coaching: boolean,
}

export interface UpdatedParticipantMuteCoach {
  success: boolean
}

class BargeCoachService extends ApiService {



  async updateParticipantBargeCoach(conferenceSid: string, participantSid: string, agentSid: string,  muted: boolean, coaching: boolean): Promise<Boolean> {
    try {
      // Update Conference Participant with the appropriate Muted and Coaching status
      const { success } = await this.#updateParticipantBargeCoach(conferenceSid, participantSid, agentSid, muted, coaching);
      if (success) {
          //FIXME: Update to .log once done testing
          console.warn(`Successfully updated Conference:${conferenceSid} for Participant:${participantSid} - Muted Status = ${muted}`);
          console.warn(`Coaching Status is ${coaching} for Agent: ${agentSid}`);
      }
      else if(!success) {
          //FIXME: Update to .error once done testing
          console.warn(`Failed to updated Conference:${conferenceSid} for Participant:${participantSid} - Muted Status = ${muted}`);
          console.warn(`Coaching Status is ${coaching} for Agent: ${agentSid}`);
      }
      return success;
    } catch (error) {
      if (error instanceof TypeError) {
        error.message = "Unable to reach host"
      }
      return false;
    }
  }  

  #updateParticipantBargeCoach = (conferenceSid: string, participantSid: string, agentSid: string,  muted: boolean, coaching: boolean): Promise<ParticipantMuteCoach> => {

    const manager = Flex.Manager.getInstance();

    const encodedParams: EncodedParams = {
      Token: encodeURIComponent(manager.user.token),
      conferenceSid: encodeURIComponent(conferenceSid),
      participantSid: encodeURIComponent(participantSid),
      agentSid: encodeURIComponent(agentSid),
      muted: encodeURIComponent(muted),
      coaching: encodeURIComponent(coaching),
    };

    return this.fetchJsonWithReject<ParticipantMuteCoach>(
      `https://${this.serverlessDomain}/functions/features/supervisor-barge-coach/participant-mute-and-coach`,
      {
        method: 'post',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: this.buildBody(encodedParams)
      }
    ).then((response): ParticipantMuteCoach => {
      return {
        ...response,
      };
    });
  };

}

export default new BargeCoachService();
