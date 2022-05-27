import * as Flex from '@twilio/flex-ui';
import { AppState, reduxNamespace } from '../../../../flex-hooks/states'

export function applySelectedCallerIdForDialedNumbers(flex: typeof Flex, manager: Flex.Manager) {

  flex.Actions.addListener('beforeStartOutboundCall', async (payload, abortFunction) => {

    const state = manager.store.getState() as AppState;
    const selectedCallerId = state[reduxNamespace].outboundCallerIdSelector.selectedCallerId

    if (!payload.callerId && selectedCallerId)
      payload.callerId = selectedCallerId;
  });
}
