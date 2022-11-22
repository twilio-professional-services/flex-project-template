import * as Flex from "@twilio/flex-ui";
import { AppState, reduxNamespace } from "../../../../flex-hooks/states";
import { isFeatureEnabled } from '../..';

export function applySelectedCallerIdForDialedNumbers(
  flex: typeof Flex,
  manager: Flex.Manager
) {
  if (!isFeatureEnabled()) return;

  flex.Actions.addListener(
    "beforeStartOutboundCall",
    async (payload, abortFunction) => {
      const state = manager.store.getState() as AppState;
      const selectedCallerId =
        state[reduxNamespace].outboundCallerIdSelector.selectedCallerId;

      if (!payload.callerId && selectedCallerId)
        payload.callerId = selectedCallerId;
    }
  );
}
