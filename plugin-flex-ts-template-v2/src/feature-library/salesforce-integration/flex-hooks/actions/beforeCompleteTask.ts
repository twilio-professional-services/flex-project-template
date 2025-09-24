import * as Flex from '@twilio/flex-ui';

import { FlexActionEvent, FlexAction } from '../../../../types/feature-loader';
import { getOpenCti } from '../../utils/SfdcHelper';
import logger from '../../../../utils/logger';
import { isActivityLoggingEnabled, isScreenPopEnabled } from '../../config';
import { reduxNamespace } from '../../../../utils/state';
import { AppState } from '../../../../types/manager';
import { SalesforceIntegrationNotification } from '../notifications';

export const actionEvent = FlexActionEvent.before;
export const actionName = FlexAction.CompleteTask;
export const actionHook = function checkRecordAssociation(flex: typeof Flex, manager: Flex.Manager) {
  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload, abortFunction) => {
    if (!isActivityLoggingEnabled() || !isScreenPopEnabled() || !getOpenCti()) {
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

    if (
      !task.attributes.sfdcObjectId &&
      (manager.store.getState() as AppState)[reduxNamespace].salesforceIntegration.screenPopSearchResults[task.sid]
        ?.length
    ) {
      // If no record ID saved, but search results in Redux, abort and notify
      flex.Notifications.showNotification(SalesforceIntegrationNotification.AssociationRequired);
      logger.warn(
        '[salesforce-integration] Task completion prevented while waiting for user to select record to associate',
      );
      abortFunction();
    }
  });
};
