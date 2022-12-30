import * as Flex from "@twilio/flex-ui";
import { FlexDeviceCall, getMyCallSid, SecondDeviceCall } from '../../helpers/MultiCallHelper';
import { isFeatureEnabled } from '../..';

export function handleMultiCallSelectTask(flex: typeof Flex, manager: Flex.Manager) {
  if (!isFeatureEnabled()) return;
  
  flex.Actions.addListener('beforeSelectTask', async (payload, abortFunction) => {
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
