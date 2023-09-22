import ApiService from '../../../utils/serverless/ApiService';
import { EncodedParams } from '../../../types/serverless';

export interface GenerateCodeReponse {
  roomName: string;
  roomSid: string;
}

export interface CompleteRoomReponse {
  success: boolean;
}

class ChatToVideoService extends ApiService {
  generateUrl = (identity: string, roomName: string): string =>
    `${this.serverlessProtocol}://${this.serverlessDomain}/features/chat-to-video-escalation/index.html?identity=${identity}&roomName=${roomName}`;

  generateVideoCode = async (taskSid: string): Promise<GenerateCodeReponse> => {
    return new Promise((resolve, reject) => {
      const encodedParams: EncodedParams = {
        Token: encodeURIComponent(this.manager.store.getState().flex.session.ssoTokenPayload.token),
        taskSid: encodeURIComponent(taskSid),
      };

      this.fetchJsonWithReject<GenerateCodeReponse>(
        `${this.serverlessProtocol}://${this.serverlessDomain}/features/chat-to-video-escalation/flex/generate-unique-code`,
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
          console.error(`Error generating unique video code\r\n`, error);
          reject(error);
        });
    });
  };

  completeRoom = async (roomSid: string): Promise<CompleteRoomReponse> => {
    return new Promise((resolve, reject) => {
      const encodedParams: EncodedParams = {
        Token: encodeURIComponent(this.manager.store.getState().flex.session.ssoTokenPayload.token),
        roomSid: encodeURIComponent(roomSid),
      };

      this.fetchJsonWithReject<CompleteRoomReponse>(
        `${this.serverlessProtocol}://${this.serverlessDomain}/features/chat-to-video-escalation/flex/complete-room`,
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
          console.error(`Error completing video room\r\n`, error);
          reject(error);
        });
    });
  };
}

export default new ChatToVideoService();
