import * as Flex from '@twilio/flex-ui';

import { FlexActionEvent, FlexAction } from '../../../../types/feature-loader';
import ActivityManager from '../../helper/ActivityManager';

export const actionEvent = FlexActionEvent.after;
export const actionName = FlexAction.SelectTask;
export const actionHook = function SetActivity(flex: typeof Flex, _manager: Flex.Manager) {
  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload) => {
    // the system auto selects outbound tasks and this would cause an issue
    // with creating the outbound call as ActivityManager.updateState is a
    // blocking operation
    if ((payload.task?.status as string) !== 'pending') await ActivityManager.enforceEvaluatedState();
  });
};
