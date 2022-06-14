import { Manager } from '@twilio/flex-ui';
import { OutboundCallerIDSelectorState } from './types';

const { workerClient } = Manager.getInstance()

const initialState: OutboundCallerIDSelectorState = {
  isFetchingPhoneNumbers: false,
  fetchingPhoneNumbersFailed: false,
  isUpdatingAttributes: false,
  updatingAttributesFailed: false,
  phoneNumbers: [],
  selectedCallerId: workerClient.attributes.selectedCallerId
};

export default initialState;