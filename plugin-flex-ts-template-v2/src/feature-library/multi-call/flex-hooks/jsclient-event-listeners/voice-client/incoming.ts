import * as Flex from '@twilio/flex-ui';
import { Call } from '@twilio/voice-sdk';
import { handleFlexCallIncoming } from '../../../helpers/MultiCallHelper';
import { getFeatureFlags } from '../../../../../utils/configuration/configuration';

const { enabled = false } = getFeatureFlags().features?.multi_call || {};

export const handleIncomingMultiCall = (_flex: typeof Flex, manager: Flex.Manager, call: Call) => {
  if (!enabled) return;
  
  handleFlexCallIncoming(manager, call);
}