import * as Flex from '@twilio/flex-ui';

import { initializeSalesforceAPIs } from '../../utils/SfdcLoader';
import { FlexEvent } from '../../../../types/feature-loader';
import { getSfdcBaseUrl, isSalesforce } from '../../utils/SfdcHelper';
import { enableClickToDial } from '../../utils/ClickToDial';
import logger from '../../../../utils/logger';
import { isClickToDialEnabled, isHideCrmContainerEnabled } from '../../config';

export const eventName = FlexEvent.pluginsInitialized;
export const eventHook = async function loadOpenCti(flex: typeof Flex, manager: Flex.Manager) {
  if (isSalesforce(getSfdcBaseUrl()) && isHideCrmContainerEnabled()) {
    // Hide Flex's own CRM container while we are embedded within Salesforce
    manager.updateConfig({
      componentProps: {
        AgentDesktopView: {
          showPanel2: false,
        },
      },
    });
  }

  let openCtiLoaded = false;
  try {
    openCtiLoaded = await initializeSalesforceAPIs();
  } catch (error: any) {
    logger.error('[salesforce-integration] Error initializing Open CTI', error);
  }

  if (!openCtiLoaded) {
    return;
  }
  logger.log('[salesforce-integration] Open CTI loaded');

  if (!isClickToDialEnabled()) {
    return;
  }

  try {
    logger.log('[salesforce-integration] Enabling click-to-dial');
    enableClickToDial();
  } catch (error: any) {
    logger.error('[salesforce-integration] Error calling Open CTI enableClickToDial', error);
  }
};
