import { Actions, Manager, Notifications, StateHelper } from '@twilio/flex-ui';

import { getOpenCti } from './SfdcHelper';
import logger from '../../../utils/logger';
import { SalesforceIntegrationNotification } from '../flex-hooks/notifications';
import { setSoftphonePanelVisibility } from './UtilityBarHelper';
import { isShowPanelAutomaticallyEnabled } from '../config';

const handleClickToDial = async (response: any) => {
  logger.log('[salesforce-integration] Performing click-to-dial', response);

  const manager = Manager.getInstance();

  // Check that this is the active Flex session
  const { singleSessionGuard } = manager.store.getState().flex.session;
  if (singleSessionGuard?.sessionInvalidated || singleSessionGuard?.otherSessionDetected) {
    logger.error(
      '[salesforce-integration] Outbound call not made as Flex session not valid per single session guard',
      singleSessionGuard,
    );
    return;
  }

  if (isShowPanelAutomaticallyEnabled()) {
    // If the Flex softphone is not visible, make it so
    // We do this here instead of relying on taskReceived so that the user can see any error notifications
    setSoftphonePanelVisibility(true);
  }

  // Check that the worker is not already on a call
  if (StateHelper.getCurrentPhoneCallState() || StateHelper.hasPendingCall()) {
    Notifications.dismissNotificationById(SalesforceIntegrationNotification.AlreadyOnPhone);
    Notifications.showNotification(SalesforceIntegrationNotification.AlreadyOnPhone);
    logger.error('[salesforce-integration] Outbound call not made as user is already on a call');
    return;
  }

  // Check that the worker is not offline
  const workerActivity = manager.store.getState().flex.worker?.activity;
  if (workerActivity?.sid === manager.serviceConfiguration.taskrouter_offline_activity_sid) {
    Notifications.dismissNotificationById(SalesforceIntegrationNotification.UnableToCallOffline);
    Notifications.showNotification(SalesforceIntegrationNotification.UnableToCallOffline, {
      activity: workerActivity?.name,
    });
    logger.error('[salesforce-integration] Outbound call not made as user is in the offline activity');
    return;
  }

  let sfdcObjectId = response.recordId;
  let sfdcObjectType = response.objectType;

  if (response.personAccount && response.contactId) {
    // When dialed from a Person Account record, prefer associating to the corresponding Contact record
    sfdcObjectId = response.contactId;
    sfdcObjectType = 'Contact';
  }

  try {
    await Actions.invokeAction('StartOutboundCall', {
      destination: response.number,
      taskAttributes: {
        sfdcObjectId,
        sfdcObjectType,
      },
    });
  } catch (error: any) {
    logger.error('[salesforce-integration] Error calling StartOutboundCall', error);
  }
};

export const enableClickToDial = () => {
  if (!getOpenCti()) {
    return;
  }

  getOpenCti().enableClickToDial({
    callback: (response: any) => {
      if (!response.success) {
        logger.error('[salesforce-integration] Failed to enable click-to-dial', response);
        return;
      }

      getOpenCti().onClickToDial({
        listener: handleClickToDial,
      });
    },
  });
};
