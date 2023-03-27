import { Manager } from '@twilio/flex-ui';

import ApiService from '../ApiService';
import { EncodedParams } from '../../../types/serverless';

export interface PhoneNumberItem {
  friendlyName: string;
  phoneNumber: string;
}

export interface ListPhoneNumbersResponse {
  success: boolean;
  phoneNumbers: Array<PhoneNumberItem>;
  expiry: number;
}

class PhoneNumberService extends ApiService {
  private flex_service_instance_sid = Manager.getInstance().serviceConfiguration.flex_service_instance_sid;

  private STORAGE_KEY = `FLEX_PHONE_NUMBERS_${this.flex_service_instance_sid}`;

  private EXPIRY = 86400000; // 1 day

  async getAccountPhoneNumbers(): Promise<ListPhoneNumbersResponse> {
    // look for value in storage first
    const cachedResult = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
    // if storage value has expired, discard
    if (cachedResult.expiry < new Date().getTime()) cachedResult.success = false;
    // if we have a valid storage value use it, otherwise get from backend.
    return cachedResult.success ? cachedResult : this.#getAccountPhoneNumbers();
  }

  #getAccountPhoneNumbers = async (): Promise<any> => {
    const encodedParams: EncodedParams = {
      Token: encodeURIComponent(this.manager.user.token),
    };

    return this.fetchJsonWithReject<ListPhoneNumbersResponse>(
      `${this.serverlessProtocol}://${this.serverlessDomain}/common/flex/phone-numbers/list-phone-numbers`,
      {
        method: 'post',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: this.buildBody(encodedParams),
      },
    ).then((response): ListPhoneNumbersResponse => {
      // if response from service was successful, store it
      if (response.success)
        localStorage.setItem(
          this.STORAGE_KEY,
          JSON.stringify({
            ...response,
            expiry: new Date().getTime() + this.EXPIRY,
          }),
        );
      return {
        ...response,
      };
    });
  };
}

export default new PhoneNumberService();
