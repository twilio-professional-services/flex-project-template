import { Actions, Manager, Notifications, StateHelper } from '@twilio/flex-ui';

import { getOpenCti } from './SfdcHelper';
import logger from '../../../utils/logger';
import { SalesforceIntegrationNotification } from '../flex-hooks/notifications';

const handleClickToDial = async (response: any) => {
  logger.log('[salesforce-integration] Performing click-to-dial', response);

  // Check that this is the active Flex session
  const { singleSessionGuard } = Manager.getInstance().store.getState().flex.session;
  if (singleSessionGuard?.sessionInvalidated || singleSessionGuard?.otherSessionDetected) {
    logger.error(
      '[salesforce-integration] Outbound call not made as Flex session not valid per single session guard',
      singleSessionGuard,
    );
    return;
  }

  // Check that the worker is not already on a call
  if (StateHelper.getCurrentPhoneCallState()) {
    Notifications.showNotification(SalesforceIntegrationNotification.AlreadyOnPhone);
    logger.error('[salesforce-integration] Outbound call not made as user is already on a call');
    return;
  }

  // If the Flex softphone is not visible, make it so
  getOpenCti().isSoftphonePanelVisible({
    callback: (response: any) => {
      if (response.success && !response.returnValue?.visible) {
        // Engage!
        getOpenCti().setSoftphonePanelVisibility({ visible: true });
      }
    },
  });

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
