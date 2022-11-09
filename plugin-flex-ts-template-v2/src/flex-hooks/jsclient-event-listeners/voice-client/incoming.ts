import * as Flex from "@twilio/flex-ui";
import { Call } from '@twilio/voice-sdk';

import { handleIncomingMultiCall } from '../../../feature-library/multi-call/flex-hooks/jsclient-event-listeners/voice-client/incoming';

export default (flex: typeof Flex, manager: Flex.Manager) => {
  manager.voiceClient.on(
    "incoming",
    (call: Call) => {
      handleIncomingMultiCall(flex, manager, call);
    }
  );
};