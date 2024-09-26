import * as Flex from '@twilio/flex-ui';

import { FlexActionEvent, FlexAction } from '../../../../types/feature-loader';
import logger from '../../../../utils/logger';
import { canRecordTask } from '../../helpers/conditionalRecordingHelper';
import { isDualChannelEnabled } from '../../config';

export const actionEvent = FlexActionEvent.before;
export const actionName = FlexAction.AcceptTask;
export const actionHook = function setRecordingFlag(flex: typeof Flex) {
  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload) => {
    if (!payload.task && !payload.sid) return;

    // If the dual-channel-recording feature is enabled, it will perform the recording instead
    if (isDualChannelEnabled()) {
      logger.warn(
        '[conditional-recording] Because the dual-channel-recording feature is enabled, the conditional-recording configuration will be ignored.',
      );
      return;
    }

    let task = payload.task;

    if (!task) {
      task = Flex.TaskHelper.getTaskByTaskSid(payload.sid);
    }

    payload.conferenceOptions.conferenceRecord = canRecordTask(task);
    logger.debug(
      `[conditional-recording] Recording flag for ${task.sid}: ${payload.conferenceOptions.conferenceRecord}`,
    );
  });
};
