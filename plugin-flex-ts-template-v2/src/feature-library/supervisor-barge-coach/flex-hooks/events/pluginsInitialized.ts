import * as Flex from '@twilio/flex-ui';

import { agentBrowserRefresh, supervisorBrowserRefresh } from '../../helpers/browserRefreshHelper';
import { isAgentCoachingPanelEnabled, isAgentAssistanceEnabled } from '../../config';
import { FlexEvent } from '../../../../types/feature-loader';

export const eventName = FlexEvent.pluginsInitialized;
export const eventHook = function updateSyncDocsAfterBrowserRefresh(_flex: typeof Flex, manager: Flex.Manager) {
  agentBrowserRefresh(isAgentCoachingPanelEnabled(), isAgentAssistanceEnabled());

  const { roles } = manager.user;
  if (roles.indexOf('admin') >= 0 || roles.indexOf('supervisor') >= 0) {
    supervisorBrowserRefresh();
  }
};
