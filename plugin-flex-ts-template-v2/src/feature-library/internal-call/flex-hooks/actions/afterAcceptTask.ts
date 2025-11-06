import * as Flex from "@twilio/flex-ui";
import { isInternalCall, waitForTransfer } from '../../helpers/internalCall';
import { FlexActionEvent, FlexAction } from '../../../../types/feature-loader';

export const actionEvent = FlexActionEvent.after;
export const actionName = FlexAction.AcceptTask;
export const actionHook = function handleInternalAfterAcceptTask(flex: typeof Flex, _manager: Flex.Manager) {
  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload, abortFunction) => {
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
};
