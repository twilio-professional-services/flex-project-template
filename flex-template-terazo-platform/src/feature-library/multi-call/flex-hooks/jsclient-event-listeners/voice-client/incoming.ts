import * as Flex from '@twilio/flex-ui';
import { Call } from '@twilio/voice-sdk';

import { handleFlexCallIncoming } from '../../../helpers/MultiCallHelper';
import { FlexJsClient, VoiceEvent } from '../../../../../types/feature-loader';

export const clientName = FlexJsClient.voiceClient;
export const eventName = VoiceEvent.incoming;
export const jsClientHook = (_flex: typeof Flex, manager: Flex.Manager, call: Call) => {
  handleFlexCallIncoming(manager, call);
};
