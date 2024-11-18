import * as Flex from '@twilio/flex-ui';

import { holdOtherCalls } from '../../helpers/MultiCallHelper';
import { FlexActionEvent, FlexAction } from '../../../../types/feature-loader';

export const actionEvent = FlexActionEvent.before;
export const actionName = FlexAction.AcceptTask;
export const actionHook = function holdOtherCallsOnAcceptTask(flex: typeof Flex) {
  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload) => {
    let task = null;

    if (payload.task) {
      task = payload.task;
    } else if (payload.sid) {
      task = Flex.TaskHelper.getTaskByTaskSid(payload.sid);
    } else {
      return;
    }

    if (task && Flex.TaskHelper.isCallTask(task)) {
      holdOtherCalls();
    }
  });
};
