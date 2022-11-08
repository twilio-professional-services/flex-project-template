import * as Flex from '@twilio/flex-ui';
import { Call } from '@twilio/voice-sdk';
import { UIAttributes } from "types/manager/ServiceConfiguration";
import { handleFlexCallIncoming } from '../../../helpers/MultiCallHelper';

const { custom_data } = Flex.Manager.getInstance().configuration as UIAttributes;
const { enabled = false } = custom_data?.features.multi_call || {};

export const handleIncomingMultiCall = (_flex: typeof Flex, manager: Flex.Manager, call: Call) => {
  if (!enabled) return;
  
  handleFlexCallIncoming(manager, call);
}