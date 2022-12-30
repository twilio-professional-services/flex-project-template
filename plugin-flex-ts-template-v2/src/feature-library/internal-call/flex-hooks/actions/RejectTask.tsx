import * as Flex from "@twilio/flex-ui";
import InternalCallService from "../../helpers/InternalCallService";
import { isInternalCall } from '../../helpers/internalCall';
import { isFeatureEnabled } from '../..';

export function handleInternalRejectTask(flex: typeof Flex, manager: Flex.Manager) {
  if (!isFeatureEnabled()) return;

  flex.Actions.addListener("beforeRejectTask", async (payload, abortFunction) => {
    if (!isInternalCall(payload.task)) {
      return;
    }
    
    abortFunction();
    await InternalCallService.rejectInternalTask(payload.task);
  });
}
