import * as Flex from "@twilio/flex-ui";
import { UIAttributes } from "types/manager/ServiceConfiguration";
import InternalCallService from "../../../../utils/serverless/InternalCall/InternalCallService";
import { isInternalCall } from '../../helpers/internalCall';

const { custom_data } = Flex.Manager.getInstance().serviceConfiguration.ui_attributes as UIAttributes;
const { enabled } = custom_data?.features?.internal_call || {};

export function handleInternalAcceptTask(flex: typeof Flex, manager: Flex.Manager) {
  if (!enabled) return;

  flex.Actions.addListener("beforeAcceptTask", async (payload, abortFunction) => {
    if (!isInternalCall(payload.task)) {
      return;
    }
    
    abortFunction();
    await InternalCallService.acceptInternalTask(payload.task.sourceObject, payload.task.taskSid);
  });
}
