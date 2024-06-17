import ApiService from '../../../utils/serverless/ApiService';
import { EncodedParams } from '../../../types/serverless';
import logger from '../../../utils/logger';

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
    const encodedParams: EncodedParams = {
      Token: encodeURIComponent(this.manager.user.token),
      taskSid: encodeURIComponent(taskSid),
    };

    try {
      return await this.fetchJsonWithReject<GenerateCodeReponse>(
        `${this.serverlessProtocol}://${this.serverlessDomain}/features/chat-to-video-escalation/flex/generate-unique-code`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: this.buildBody(encodedParams),
        },
      );
    } catch (error: any) {
      logger.error(`[chat-to-video-escalation] Error generating unique video code\r\n`, error);
      throw error;
    }
  };

  completeRoom = async (roomSid: string): Promise<CompleteRoomReponse> => {
    const encodedParams: EncodedParams = {
      Token: encodeURIComponent(this.manager.user.token),
      roomSid: encodeURIComponent(roomSid),
    };
    try {
      return await this.fetchJsonWithReject<CompleteRoomReponse>(
        `${this.serverlessProtocol}://${this.serverlessDomain}/features/chat-to-video-escalation/flex/complete-room`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: this.buildBody(encodedParams),
        },
      );
    } catch (error: any) {
      logger.error(`[chat-to-video-escalation] Error completing video room\r\n`, error);
      throw error;
    }
  };
}

export default new ChatToVideoService();
