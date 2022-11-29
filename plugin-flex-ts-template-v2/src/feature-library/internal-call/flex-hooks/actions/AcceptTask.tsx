import * as Flex from "@twilio/flex-ui";
import { UIAttributes } from "types/manager/ServiceConfiguration";
import { isInternalCall, waitForTransfer } from '../../helpers/internalCall';

const { custom_data } = Flex.Manager.getInstance().configuration as UIAttributes;
const { enabled = false } = custom_data?.features?.internal_call || {};

export function handleInternalAcceptTask(flex: typeof Flex, manager: Flex.Manager) {
  if (!enabled) return;
  
  flex.Actions.addListener("beforeAcceptTask", async (payload, abortFunction) => {
    if (!isInternalCall(payload.task) || payload.task.incomingTransferObject) {
      return;
    }
    
    payload.conferenceOptions = {
      endConferenceOnCustomerExit: false,
      endConferenceOnExit: true
    };
  });

  flex.Actions.addListener("afterAcceptTask", async (payload) => {
    if (!isInternalCall(payload.task) || payload.task.incomingTransferObject) {
      return;
    }
    
    const canTransfer = await waitForTransfer(payload.task);
    
    if (!canTransfer) {
      // If we can't transfer, just end it
      flex.Actions.invokeAction("HangupCall", { task: payload.task });
      return;
    }
    
    try {
      await flex.Actions.invokeAction('TransferTask', {
        task: payload.task,
        sid: payload.task.sid,
        targetSid: payload.task.attributes.targetWorkerSid,
        options: { mode: 'WARM' }
      });
    } catch (error) {
      // likely that the desired worker has no capacity
      console.log('Unable to transfer task to begin internal call', error);
      flex.Actions.invokeAction("HangupCall", { task: payload.task });
    }
  });
}