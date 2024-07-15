import * as Flex from '@twilio/flex-ui';

import { FlexActionEvent, FlexAction } from '../../../../types/feature-loader';
import { getRegion } from '../../config';

export const actionEvent = FlexActionEvent.before;
export const actionName = FlexAction.AcceptTask;
export const actionHook = function setConferenceRegion(flex: typeof Flex, _manager: Flex.Manager) {
  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload, _abortFunction) => {
    if (!Flex.TaskHelper.isCallTask(payload.task ?? Flex.TaskHelper.getTaskByTaskSid(payload.sid))) {
      return;
    }

    // Set the conference region for the initial call based on configuration
    const region = getRegion();
    if (region && region !== '') {
      console.log(`[force-conference-region] Setting conferenceOptions.region = ${region}`);
      payload.conferenceOptions.region = region;
    } else {
      console.log(`[force-conference-region] Region not set for call`);
    }
  });
};
