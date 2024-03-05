import * as Flex from '@twilio/flex-ui';

import { FlexActionEvent } from '../../../../types/feature-loader';
import ActivityManager from '../../helper/ActivityManager';
import logger from '../../../../utils/logger';

export const actionEvent = FlexActionEvent.after;
export const actionName = 'ExtendWrapUp';
export const actionHook = function setExtendedWrapUpActivity(flex: typeof Flex, _manager: Flex.Manager) {
  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload) => {
    logger.debug(`activity-reservation-handler: handle ${actionName} for ${payload.task?.sid}`);

    await ActivityManager.enforceEvaluatedState();
  });
};
