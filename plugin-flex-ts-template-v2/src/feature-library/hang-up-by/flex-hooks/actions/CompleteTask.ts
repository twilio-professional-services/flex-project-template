import * as Flex from '@twilio/flex-ui';

import * as HangUpByHelper from '../../helpers/hangUpBy';
import { HangUpBy } from '../../enums/hangUpBy';
import TaskRouterService from '../../../../utils/serverless/TaskRouter/TaskRouterService';
import { FlexActionEvent, FlexAction } from '../../../../types/feature-loader';

export const actionEvent = FlexActionEvent.before;
export const actionName = FlexAction.CompleteTask;
export const actionHook = function reportHangUpByCompleteTask(flex: typeof Flex, _manager: Flex.Manager) {
  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload, _abortFunction) => {
    let currentHangUpBy = HangUpByHelper.getHangUpBy()[payload.sid];

    if (!currentHangUpBy) {
      currentHangUpBy = HangUpBy.Customer;
      HangUpByHelper.setHangUpBy(payload.sid, currentHangUpBy);
    }

    if (currentHangUpBy === HangUpBy.CompletedExternalWarmTransfer) {
      // We shouldn't get here, but added a safety net so this value doesn't get saved.
      currentHangUpBy = HangUpBy.ExternalWarmTransfer;
      HangUpByHelper.setHangUpBy(payload.sid, currentHangUpBy);
    }

    const attributes = {
      conversations: {
        hang_up_by: currentHangUpBy,
      },
    };

    try {
      const task = Flex.TaskHelper.getTaskByTaskSid(payload.sid);

      if (task.attributes && !task.attributes.conference) {
        // no conference? no call! this functionality is call-specific, so return.
        return;
      }

      await TaskRouterService.updateTaskAttributes(task.taskSid, attributes, true);
      console.log(`Set conversation attributes for ${task.taskSid}`, attributes);
    } catch (error) {
      console.log(`Failed to set conversation attributes for ${payload.sid}`, error);
    }
  });
};
