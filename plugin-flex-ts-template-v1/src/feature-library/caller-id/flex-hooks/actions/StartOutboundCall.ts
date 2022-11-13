import * as Flex from '@twilio/flex-ui';
import { AppState, reduxNamespace } from '../../../../flex-hooks/states'
import { UIAttributes } from 'types/manager/ServiceConfiguration';

const { custom_data } = Flex.Manager.getInstance().configuration as UIAttributes;
const { enabled } = custom_data.features.caller_id;

export function applySelectedCallerIdForDialedNumbers(flex: typeof Flex, manager: Flex.Manager) {

  if(!enabled) return;

  flex.Actions.addListener('beforeStartOutboundCall', async (payload, abortFunction) => {

    const state = manager.store.getState() as AppState;
    const selectedCallerId = state[reduxNamespace].outboundCallerIdSelector.selectedCallerId

    if (!payload.callerId && selectedCallerId)
      payload.callerId = selectedCallerId;
  });
}
