import * as Flex from '@twilio/flex-ui';

import { EncodedParams } from '../../../../types/serverless';
import ApiService from '../../../../utils/serverless/ApiService';

export interface ParticipantMuteCoach {
  success: boolean;
  conferenceSid: string;
  participantSid: string;
  agentSid: string;
  muted: boolean;
  coaching: boolean;
}

export interface UpdatedParticipantMuteCoach {
  success: boolean;
}

export interface InviteWorkerParticipant {
  success: boolean;
  conferenceSid: string;
  myWorkerName: string;
}

export interface RemoveWorkerParticipant {
  success: boolean;
  conferenceSid: string;
  myWorkerName: string;
}

export interface GetParticipants {
  response: any;
  conferenceSid: string;
  result: any;
}

export interface updateConversationStatus {
  success: boolean;
  conferenceSid: string;
  status: string;
}

class BargeCoachService extends ApiService {
  async updateParticipantBargeCoach(
    conferenceSid: string,
    participantSid: string,
    agentSid: string,
    muted: boolean,
    coaching: boolean,
  ): Promise<boolean> {
    try {
      // Update Conference Participant with the appropriate Muted and Coaching status
      const { success } = await this.#updateParticipantBargeCoach(
        conferenceSid,
        participantSid,
        agentSid,
        muted,
        coaching,
      );
      if (success) {
        console.log(
          `Successfully updated Conference:${conferenceSid} for Participant:${participantSid} - Muted Status = ${muted}`,
        );
        console.log(`Coaching Status is ${coaching} for Agent: ${agentSid}`);
      } else if (!success) {
        console.log(
          `Failed to updated Conference:${conferenceSid} for Participant:${participantSid} - Muted Status = ${muted}`,
        );
        console.log(`Coaching Status is ${coaching} for Agent: ${agentSid}`);
      }
      return success;
    } catch (error) {
      if (error instanceof TypeError) {
        error.message = 'Unable to reach host';
      }
      return false;
    }
  }

  async inviteWorkerParticipant(conversationSid: string, myWorkerName: string): Promise<boolean> {
    try {
      // Update Conference Participant with the appropriate Muted and Coaching status
      const { success } = await this.#inviteWorkerParticipant(conversationSid, myWorkerName);
      if (success) {
        console.log(`Successfully added Participant: ${myWorkerName} to Conversation:${conversationSid}`);
      } else if (!success) {
        console.log(`Failed to add Participant: ${myWorkerName} to Conversation:${conversationSid}`);
      }
      return success;
    } catch (error) {
      if (error instanceof TypeError) {
        error.message = 'Unable to reach host';
      }
      return false;
    }
  }

  async removeWorkerParticipant(conversationSid: string, myWorkerName: string): Promise<boolean> {
    try {
      // Update Conference Participant with the appropriate Muted and Coaching status
      const { success } = await this.#removeWorkerParticipant(conversationSid, myWorkerName);
      if (success) {
        console.log(`Successfully removed Participant: ${myWorkerName} from Conversation:${conversationSid}`);
      } else if (!success) {
        console.log(`Failed to remove Participant: ${myWorkerName} from Conversation:${conversationSid}`);
      }
      return success;
    } catch (error) {
      if (error instanceof TypeError) {
        error.message = 'Unable to reach host';
      }
      return false;
    }
  }

  #updateParticipantBargeCoach = async (
    conferenceSid: string,
    participantSid: string,
    agentSid: string,
    muted: boolean,
    coaching: boolean,
  ): Promise<ParticipantMuteCoach> => {
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
      `${this.serverlessProtocol}://${this.serverlessDomain}/features/supervisor-barge-coach/flex/participant-mute-and-coach`,
      {
        method: 'post',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: this.buildBody(encodedParams),
      },
    ).then((response): ParticipantMuteCoach => {
      return {
        ...response,
      };
    });
  };

  #inviteWorkerParticipant = async (
    conversationSid: string,
    myWorkerName: string,
  ): Promise<InviteWorkerParticipant> => {
    const manager = Flex.Manager.getInstance();

    const encodedParams: EncodedParams = {
      Token: encodeURIComponent(manager.user.token),
      conversationSid: encodeURIComponent(conversationSid),
      myWorkerName: encodeURIComponent(myWorkerName),
    };

    return this.fetchJsonWithReject<InviteWorkerParticipant>(
      `${this.serverlessProtocol}://${this.serverlessDomain}/common/flex/conversations/invite-worker-participant`,
      {
        method: 'post',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: this.buildBody(encodedParams),
      },
    ).then((response): InviteWorkerParticipant => {
      return {
        ...response,
      };
    });
  };

  #removeWorkerParticipant = async (
    conversationSid: string,
    myWorkerName: string,
  ): Promise<RemoveWorkerParticipant> => {
    const manager = Flex.Manager.getInstance();

    const encodedParams: EncodedParams = {
      Token: encodeURIComponent(manager.user.token),
      conversationSid: encodeURIComponent(conversationSid),
      myWorkerName: encodeURIComponent(myWorkerName),
    };

    return this.fetchJsonWithReject<RemoveWorkerParticipant>(
      `${this.serverlessProtocol}://${this.serverlessDomain}/common/flex/conversations/remove-worker-participant`,
      {
        method: 'post',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: this.buildBody(encodedParams),
      },
    ).then((response): RemoveWorkerParticipant => {
      return {
        ...response,
      };
    });
  };
}

export default new BargeCoachService();
