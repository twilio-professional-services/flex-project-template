import * as Flex from "@twilio/flex-ui";
import { Call } from '@twilio/voice-sdk';


export default (flex: typeof Flex, manager: Flex.Manager) => {
  manager.voiceClient.on(
    "incoming",
    (call: Call) => {
      
    }
  );
};
