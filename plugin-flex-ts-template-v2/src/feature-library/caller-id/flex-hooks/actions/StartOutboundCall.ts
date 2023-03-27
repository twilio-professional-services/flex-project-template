import * as Flex from '@twilio/flex-ui';

import AppState from '../../../../types/manager/AppState';
import { FlexActionEvent, FlexAction } from '../../../../types/feature-loader';
import { reduxNamespace } from '../../../../utils/state';

export const actionEvent = FlexActionEvent.before;
export const actionName = FlexAction.StartOutboundCall;
export const actionHook = function applySelectedCallerIdForDialedNumbers(flex: typeof Flex, manager: Flex.Manager) {
  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload, _abortFunction) => {
    const state = manager.store.getState() as AppState;
    const { selectedCallerId } = state[reduxNamespace].outboundCallerIdSelector;

    if (!payload.callerId && selectedCallerId) payload.callerId = selectedCallerId;
  });
};
