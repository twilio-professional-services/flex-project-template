import * as Flex from '@twilio/flex-ui';

import { FlexActionEvent, FlexAction } from '../../../../types/feature-loader';
import { saveLog } from '../../utils/LogActivity';
import { getOpenCti } from '../../utils/SfdcHelper';
import logger from '../../../../utils/logger';
import { isActivityLoggingEnabled } from '../../config';

export const actionEvent = FlexActionEvent.after;
export const actionName = FlexAction.CompleteTask;
export const actionHook = function saveCallLog(flex: typeof Flex) {
  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload) => {
    if (!isActivityLoggingEnabled() || !getOpenCti()) {
      return;
    }

    let task;

    if (payload.task) {
      task = payload.task;
    } else if (payload.sid) {
      task = flex.TaskHelper.getTaskByTaskSid(payload.sid);
    }

    if (!task) {
      return;
    }

    try {
      logger.log(`[salesforce-integration] Saving task log for ${task.taskSid}`);
      saveLog(task, 'Completed', (response: any) => {
        if (response.success) {
          logger.log('[salesforce-integration] Saved task log', response.returnValue);
          (window as any).sforce.opencti.refreshView();
          return;
        }
        logger.error('[salesforce-integration] Unable to save task log', response.errors);
      });
    } catch (error: any) {
      logger.error('[salesforce-integration] Error calling Open CTI saveLog', error);
    }
  });
};
