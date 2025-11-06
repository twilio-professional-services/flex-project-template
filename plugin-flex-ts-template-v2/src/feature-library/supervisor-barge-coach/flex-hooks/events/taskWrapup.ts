import * as Flex from '@twilio/flex-ui';

import { FlexEvent } from '../../../../types/feature-loader';
import { isAgentAssistanceEnabled, isAgentCoachingPanelEnabled } from '../../config';
import { SyncDoc } from '../../utils/sync/Sync';
import { SupervisorBargeCoachState } from '../states/SupervisorBargeCoachSlice';
import AppState from '../../../../types/manager/AppState';
import { reduxNamespace } from '../../../../utils/state';

export const eventName = FlexEvent.taskWrapup;
export const eventHook = function cleanStateAndSyncUponAgentHangUp(_flex: typeof Flex, manager: Flex.Manager) {
  if (!isAgentCoachingPanelEnabled() && !isAgentAssistanceEnabled()) return;

  const agentWorkerSID = manager.store.getState().flex?.worker?.worker?.sid || '';

  if (isAgentCoachingPanelEnabled()) {
    // If agent_coaching_panel feature is enabled, clear the Sync Doc
    const agentSyncDoc = `syncDoc.${agentWorkerSID}`;
    SyncDoc.clearSyncDoc(agentSyncDoc);
  }

  if (isAgentAssistanceEnabled()) {
    // Reset assistance in case it was activated when the call ended
    const { agentAssistanceButton } = (manager.store.getState() as AppState)[reduxNamespace]
      .supervisorBargeCoach as SupervisorBargeCoachState;

    if (!agentAssistanceButton) return;

    SyncDoc.initSyncDocAgentAssistance(agentWorkerSID, '', '', '', 'remove');
  }
};
