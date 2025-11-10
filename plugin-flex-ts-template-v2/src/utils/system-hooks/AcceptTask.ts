import * as Flex from '@twilio/flex-ui';

import { FlexActionEvent, FlexAction } from '../../types/feature-loader';

export const actionEvent = FlexActionEvent.before;
export const actionName = FlexAction.AcceptTask;
export const actionHook = function handleApplicationSidAcceptTask(flex: typeof Flex, manager: Flex.Manager) {
  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload) => {
    if (payload.task?.attributes?.to?.startsWith('AP') && payload.task?.attributes?.to?.length === 34) {
      // TaskRouter uses the `to` attribute as the caller ID for the agent call leg.
      // When the `to` attribute is an application SID, the agent call leg will fail to establish, as that is not a valid caller ID.
      // Instead, use the dialpad caller ID by default, and if that is not configured, fall back to contact_uri.
      const { caller_id } = manager.serviceConfiguration.outbound_call_flows.default;
      const contact_uri = manager.workerClient?.attributes?.contact_uri;

      payload.conferenceOptions.from = caller_id ?? contact_uri;
    }
  });
};
