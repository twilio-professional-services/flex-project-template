import ApiService from '../../../utils/serverless/ApiService';
import { EncodedParams } from '../../../types/serverless';

export interface StartColdTransferResponse {
  success: boolean;
}

class CustomTransferDirectoryService extends ApiService {
  async startColdTransfer(callSid: string, to: string, from?: string): Promise<boolean> {
    const { success } = await this.#startColdTransfer(callSid, to, from);
    return success;
  }

  #startColdTransfer = async (callSid: string, to: string, from?: string): Promise<any> => {
    const encodedParams: EncodedParams = {
      Token: encodeURIComponent(this.manager.store.getState().flex.session.ssoTokenPayload.token),
      callSid: encodeURIComponent(callSid),
      to: encodeURIComponent(to),
      from: from ? encodeURIComponent(from) : '',
    };

    return this.fetchJsonWithReject<StartColdTransferResponse>(
      `${this.serverlessProtocol}://${this.serverlessDomain}/common/flex/programmable-voice/cold-transfer`,
      {
        method: 'post',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: this.buildBody(encodedParams),
      },
    );
  };
}

export default new CustomTransferDirectoryService();
