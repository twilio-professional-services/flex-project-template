import * as Flex from "@twilio/flex-ui";
import InternalCallService from "../../helpers/InternalCallService";
import { isInternalCall } from '../../helpers/internalCall';
import { getFeatureFlags } from '../../../../utils/configuration/configuration';

const { enabled = false } = getFeatureFlags().features?.internal_call || {};

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
