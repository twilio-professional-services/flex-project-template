import * as Flex from '@twilio/flex-ui';

import { agentBrowserRefresh, supervisorBrowserRefresh } from '../../helpers/browserRefreshHelper';
import { isAgentCoachingPanelEnabled, isAgentAssistanceEnabled } from '../../config';
import { FlexEvent } from '../../../../types/feature-loader';
import { subscribeAgentDoc } from '../../helpers/bargeCoachHelper';
import { syncUpdatesSupervisor } from '../../helpers/supervisorAlertHelper';

export const eventName = FlexEvent.pluginsInitialized;
export const eventHook = function initializeSyncDocs(_flex: typeof Flex, manager: Flex.Manager) {
  // Handle clearing Sync docs as appropriate after a browser refresh
  agentBrowserRefresh(isAgentCoachingPanelEnabled(), isAgentAssistanceEnabled());

  const { roles } = manager.user;
  if (roles.indexOf('admin') >= 0 || roles.indexOf('supervisor') >= 0) {
    supervisorBrowserRefresh();

    if (isAgentAssistanceEnabled()) {
      // Subscribe to agent assistance Sync doc
      syncUpdatesSupervisor();
    }
  }

  if (isAgentCoachingPanelEnabled()) {
    // Subscribe to the current worker's Sync doc
    subscribeAgentDoc(manager);
  }
};
