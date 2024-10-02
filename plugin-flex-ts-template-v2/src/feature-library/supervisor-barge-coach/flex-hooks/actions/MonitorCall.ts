import * as Flex from '@twilio/flex-ui';

import { FlexAction, FlexActionEvent } from '../../../../types/feature-loader';
import { enterListenMode } from '../../helpers/bargeCoachHelper';

export const actionName = FlexAction.MonitorCall;
export const actionEvent = FlexActionEvent.after;
export const actionHook = async function enableBargeCoachButtonsUponMonitor(flex: typeof Flex) {
  // Listening for supervisor to monitor the call to reset their muted/coaching states
  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload) => {
    const conferenceSid = payload.task?.conference?.conferenceSid;
    if (!conferenceSid) return;
    enterListenMode(conferenceSid);
  });
};
