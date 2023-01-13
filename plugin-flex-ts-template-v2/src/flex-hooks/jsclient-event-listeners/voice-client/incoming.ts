import * as Flex from "@twilio/flex-ui";
// @ts-ignore
import featureIncoming from "../../../feature-library/*/flex-hooks/jsclient-event-listeners/voice-client/incoming.*";

export default (flex: typeof Flex, manager: Flex.Manager) => {
  if (typeof featureIncoming === 'undefined') {
    return;
  }
  
  manager.voiceClient.on(
    "incoming",
    (call) => {
      featureIncoming.forEach((file: any) => {
        file.default(flex, manager, call);
      });
    }
  );
};