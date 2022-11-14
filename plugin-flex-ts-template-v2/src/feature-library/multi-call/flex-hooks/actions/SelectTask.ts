import * as Flex from "@twilio/flex-ui";
import { UIAttributes } from "types/manager/ServiceConfiguration";
import { FlexDeviceCall, getMyCallSid, SecondDeviceCall } from '../../helpers/MultiCallHelper';

const { custom_data } = Flex.Manager.getInstance().configuration as UIAttributes;
const { enabled = false } = custom_data?.features.multi_call || {};

export function handleMultiCallSelectTask(flex: typeof Flex, manager: Flex.Manager) {
  if (!enabled) return;
  
  flex.Actions.addListener('beforeSelectTask', async (payload: any, abortFunction: () => void) => {
    let task = null;
    
    if (payload.task) {
      task = payload.task;
    } else if (payload.sid) {
      task = Flex.TaskHelper.getTaskByTaskSid(payload.sid);
    } else {
      // deselected task; do nothing
      return;
    }
    
    const callSid = getMyCallSid(task);
    
    if (!callSid) {
      return;
    }
    
    // update state with the currently selected call
    if (SecondDeviceCall && callSid === SecondDeviceCall.parameters.CallSid) {
      manager.store.dispatch({type:"PHONE_ADD_CALL", payload:SecondDeviceCall});
    } else if (FlexDeviceCall && callSid === FlexDeviceCall.parameters.CallSid) {
      manager.store.dispatch({type:"PHONE_ADD_CALL", payload:FlexDeviceCall});
    }
    
  });
}
