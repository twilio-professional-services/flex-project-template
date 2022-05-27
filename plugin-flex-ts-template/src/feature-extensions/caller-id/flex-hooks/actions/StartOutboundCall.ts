import * as Flex from '@twilio/flex-ui';

export function applySelectedCallerIdForDialedNumbers(flex: typeof Flex, manager: Flex.Manager) {

  flex.Actions.addListener('beforeStartOutboundCall', async (payload, abortFunction) => {
    const selectedCallerId = manager.store.getState().stripe.outboundCallerIdSelector.selectedCallerId

    if (!payload.callerId && selectedCallerId)
      payload.callerId = selectedCallerId;
  });
}
