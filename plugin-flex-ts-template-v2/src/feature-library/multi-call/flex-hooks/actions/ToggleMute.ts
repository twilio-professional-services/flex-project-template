import * as Flex from "@twilio/flex-ui";
import { UIAttributes } from "types/manager/ServiceConfiguration";
import { SecondDeviceCall } from '../../helpers/MultiCallHelper';

const { custom_data } = Flex.Manager.getInstance().serviceConfiguration.ui_attributes as UIAttributes;
const { enabled = false } = custom_data?.features.multi_call || {};

export function handleMultiCallToggleMute(flex: typeof Flex, manager: Flex.Manager) {
  if (!enabled) return;
  
  flex.Actions.addListener('beforeToggleMute', async (payload: any, abortFunction: () => void) => {
    if (SecondDeviceCall) {
      console.log('MultiCall: SecondDevice toggling mute')
      SecondDeviceCall.mute(!SecondDeviceCall.isMuted());
      abortFunction();
    }
  });
}
