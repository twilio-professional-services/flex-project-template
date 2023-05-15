import * as Flex from '@twilio/flex-ui';

import { FlexActionEvent, FlexAction } from '../../../types/feature-loader';
import TaskRouterService from './TaskRouterService';

export const actionEvent = FlexActionEvent.replace;
export const actionName = FlexAction.CompleteTask;
export const actionHook = function updatePendingTaskAttributesAtCompleteTask(
  flex: typeof Flex,
  _manager: Flex.Manager,
) {
  flex.Actions.replaceAction(`${actionName}`, async (payload, original) => {
    // Execute any pending task attribute updates
    if (payload.task?.taskSid) {
      await TaskRouterService.updateTaskAttributes(payload.task.taskSid, {});
    }

    // Carry on
    original(payload);
  });
};
