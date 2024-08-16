import * as React from 'react';
import { TaskHelper, useFlexSelector, ITask, IconButton, templates } from '@twilio/flex-ui';
import { useSelector } from 'react-redux';
import { Flex } from '@twilio-paste/core/flex';
import { Tooltip } from '@twilio-paste/core/tooltip';

import { reduxNamespace } from '../../../../utils/state';
import { AppState } from '../../../../types/manager';
import { StringTemplates } from '../../flex-hooks/strings/BargeCoachAssist';
import { syncUpdatesAgent } from '../../helpers/supervisorAlertHelper';
// Used for Sync Docs
import { SyncDoc } from '../../utils/sync/Sync';

type AgentAssistanceButtonProps = {
  task: ITask;
};

export const AgentAssistanceButton = ({ task }: AgentAssistanceButtonProps) => {
  const { agentAssistanceButton } = useSelector((state: AppState) => state[reduxNamespace].supervisorBargeCoach);

  const agentWorkerSID = useFlexSelector((state) => state?.flex?.worker?.worker?.sid) || '';
  const agentFN = useFlexSelector((state) => state?.flex?.worker?.attributes?.full_name) || '';
  const selectedTaskSID = useFlexSelector((state) => state?.flex?.view?.selectedTaskSid) || '';

  // On click we will be pulling the conference SID, toggling the agent assistance button respectively,
  // and updating the sync doc with the agent's assistance status (either adding or removing them)
  const agentAssistanceClick = async () => {
    const conference = task && task.conference;
    const conferenceSID = conference?.conferenceSid || '';
    const newValue = !agentAssistanceButton;
    const updateStatus = newValue ? 'add' : 'remove';

    if (newValue) {
      // Subscribe to updates if we turned on assistance
      await syncUpdatesAgent();
    }

    // Updating the Sync Doc to add/remove the agent from the assistance array
    SyncDoc.initSyncDocAgentAssistance(agentWorkerSID, agentFN, conferenceSID, selectedTaskSID, updateStatus);
  };

  // Return the agent assistance button, disable if the call isn't live
  // Toggle the icon based on agent assistance status
  const isLiveCall = TaskHelper.isLiveCall(task);
  return (
    <Flex hAlignContent="center" vertical padding="space100">
      <Tooltip
        text={
          agentAssistanceButton
            ? templates[StringTemplates.TurnOffAssistance]()
            : templates[StringTemplates.AskForAssistance]()
        }
        placement="right"
      >
        <IconButton
          icon={agentAssistanceButton ? 'HelpBold' : 'Help'}
          disabled={!isLiveCall}
          onClick={agentAssistanceClick}
          variant="secondary"
          style={{ width: '44px', height: '44px' }}
        >
          {agentAssistanceButton ? templates[StringTemplates.AssistanceRequired]() : ''}
        </IconButton>
      </Tooltip>
    </Flex>
  );
};
