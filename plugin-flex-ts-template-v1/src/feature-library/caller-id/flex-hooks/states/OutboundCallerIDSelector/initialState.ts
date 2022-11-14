import { Manager } from '@twilio/flex-ui';
import { OutboundCallerIDSelectorState } from './types';
import { WorkerAttributes } from '../../../../../types/task-router/Worker'

const  { selectedCallerId }  = Manager.getInstance().workerClient.attributes as WorkerAttributes;

const initialState: OutboundCallerIDSelectorState = {
  isFetchingPhoneNumbers: false,
  fetchingPhoneNumbersFailed: false,
  isUpdatingAttributes: false,
  updatingAttributesFailed: false,
  phoneNumbers: [],
  selectedCallerId: selectedCallerId
};

export default initialState;
