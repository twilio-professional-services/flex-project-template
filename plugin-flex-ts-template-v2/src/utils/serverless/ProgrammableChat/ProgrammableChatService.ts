import * as Flex from '@twilio/flex-ui';

import { EncodedParams } from '../../../types/serverless';
import ApiService from '../ApiService';

export interface UpdateChannelAttributesResponse {
  success: boolean;
}

class ProgrammableChatService extends ApiService {
  async updateChannelAttributes(channelSid: string, attributes: any): Promise<boolean> {
    try {
      const { success } = await this.#updateChannelAttributes(channelSid, JSON.stringify(attributes));
      return success;
    } catch (error) {
      return false;
    }
  }

  #updateChannelAttributes = async (channelSid: string, attributes: any): Promise<UpdateChannelAttributesResponse> => {
    const manager = Flex.Manager.getInstance();

    const encodedParams: EncodedParams = {
      Token: encodeURIComponent(manager.user.token),
      channelSid: encodeURIComponent(channelSid),
      attributes: encodeURIComponent(attributes),
    };

    return this.fetchJsonWithReject<UpdateChannelAttributesResponse>(
      `${this.serverlessProtocol}://${this.serverlessDomain}/common/flex/programmable-chat/update-channel-attributes`,
      {
        method: 'post',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: this.buildBody(encodedParams),
      },
    ).then((response): UpdateChannelAttributesResponse => {
      return {
        ...response,
      };
    });
  };
}

export default new ProgrammableChatService();
