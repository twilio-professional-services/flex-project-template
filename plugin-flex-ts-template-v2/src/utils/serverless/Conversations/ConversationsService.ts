import * as Flex from '@twilio/flex-ui';

import { EncodedParams } from '../../../types/serverless';
import ApiService from '../ApiService';

export interface UpdateAttributesResponse {
  success: boolean;
}

class ConversationsService extends ApiService {
  async updateChannelAttributes(conversationSid: string, attributes: any): Promise<boolean> {
    try {
      const { success } = await this.#updateAttributes(conversationSid, JSON.stringify(attributes));
      return success;
    } catch (error) {
      return false;
    }
  }

  #updateAttributes = async (conversationSid: string, attributes: any): Promise<UpdateAttributesResponse> => {
    const manager = Flex.Manager.getInstance();

    const encodedParams: EncodedParams = {
      Token: encodeURIComponent(manager.user.token),
      conversationSid: encodeURIComponent(conversationSid),
      attributes: encodeURIComponent(attributes),
    };

    return this.fetchJsonWithReject<UpdateAttributesResponse>(
      `${this.serverlessProtocol}://${this.serverlessDomain}/common/flex/conversations/update-attributes`,
      {
        method: 'post',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: this.buildBody(encodedParams),
      },
    ).then((response): UpdateAttributesResponse => {
      return {
        ...response,
      };
    });
  };
}

export default new ConversationsService();
