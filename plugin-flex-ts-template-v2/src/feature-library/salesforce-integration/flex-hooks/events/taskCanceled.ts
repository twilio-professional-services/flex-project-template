import * as Flex from '@twilio/flex-ui';

import { FlexEvent } from '../../../../types/feature-loader';
import { saveLog } from '../../utils/LogActivity';
import { getOpenCti } from '../../utils/SfdcHelper';
import logger from '../../../../utils/logger';

export const eventName = FlexEvent.taskCanceled;
export const eventHook = function saveCanceledCallLog(flex: typeof Flex, manager: Flex.Manager, task: Flex.ITask) {
  try {
    if (!getOpenCti()) {
      return;
    }
    logger.log(`[salesforce-integration] Saving canceled task log for ${task.taskSid}`);
    saveLog(task, 'Canceled', (response: any) => {
      if (response.success) {
        logger.log('[salesforce-integration] Saved canceled task log', response.returnValue);
        (window as any).sforce.opencti.refreshView();
        return;
      }
      logger.error('[salesforce-integration] Unable to save canceled task log', response.errors);
    });
  } catch (error: any) {
    logger.error('[salesforce-integration] Error calling Open CTI saveLog', error);
  }
};
