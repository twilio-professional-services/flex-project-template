import * as Flex from "@twilio/flex-ui";
import { UIAttributes } from "types/manager/ServiceConfiguration";
import { SecondDeviceCall } from '../../helpers/MultiCallHelper';

const { custom_data } = Flex.Manager.getInstance().serviceConfiguration.ui_attributes as UIAttributes;
const { enabled = false } = custom_data?.features.multi_call || {};

export function handleMultiCallHangupCall(flex: typeof Flex, manager: Flex.Manager) {
  if (!enabled) return;
  
  flex.Actions.addListener('beforeHangupCall', async (payload: any, abortFunction: () => void) => {
    
    if (SecondDeviceCall && payload.task && payload.task.conference && payload.task.conference.participants) {
      // If a SecondDeviceCall is in flight, make sure we end that one.
      // If we don't abort, Flex will end the FlexDeviceCall instead.
      payload.task.conference.participants.forEach((p: Flex.ConferenceParticipant) => {
        // Find our worker in the list of participants to get the call SID to end.
        if (p.isCurrentWorker && p.callSid === SecondDeviceCall?.parameters.CallSid) {
          console.log('MultiCall: SecondDevice hangup')
          SecondDeviceCall?.disconnect();
          abortFunction();
        }
      });
    }
    
  });
}
