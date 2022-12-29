import * as Flex from '@twilio/flex-ui';
import { Call } from '@twilio/voice-sdk';
import { handleFlexCallIncoming } from '../../../helpers/MultiCallHelper';
import { isFeatureEnabled } from '../../..';

export const handleIncomingMultiCall = (_flex: typeof Flex, manager: Flex.Manager, call: Call) => {
  if (!isFeatureEnabled()) return;
  
  handleFlexCallIncoming(manager, call);
}