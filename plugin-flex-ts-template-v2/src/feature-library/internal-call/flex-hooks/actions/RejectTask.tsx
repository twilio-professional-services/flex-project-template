import * as Flex from "@twilio/flex-ui";
import { UIAttributes } from "types/manager/ServiceConfiguration";
import InternalCallService from "../../../../utils/serverless/InternalCall/InternalCallService";
import { isInternalCall } from '../../helpers/internalCall';

const { custom_data } = Flex.Manager.getInstance().serviceConfiguration.ui_attributes as UIAttributes;
const { enabled } = custom_data?.features?.internal_call || {};

export function handleInternalRejectTask(flex: typeof Flex, manager: Flex.Manager) {
  if (!enabled) return;

  flex.Actions.addListener("beforeRejectTask", async (payload, abortFunction) => {
    if (!isInternalCall(payload.task)) {
      return;
    }
    
    abortFunction();
    await InternalCallService.rejectInternalTask(payload.task);
  });
}
