import * as React from 'react';
import { TaskHelper, useFlexSelector, ITask, IconButton, templates } from '@twilio/flex-ui';
import { useDispatch, useSelector } from 'react-redux';
import { Flex, Tooltip } from '@twilio-paste/core';

import { reduxNamespace } from '../../../../utils/state';
import { AppState } from '../../../../types/manager';
import { Actions } from '../../flex-hooks/states/SupervisorBargeCoach';
import { StringTemplates } from '../../flex-hooks/strings/BargeCoachAssist';
// Used for Sync Docs
import { SyncDoc } from '../../utils/sync/Sync';

type AgentAssistanceButtonProps = {
  task: ITask;
};

export const AgentAssistanceButton = ({ task }: AgentAssistanceButtonProps) => {
  const dispatch = useDispatch();

  const { agentAssistanceButton } = useSelector((state: AppState) => state[reduxNamespace].supervisorBargeCoach);

  const agentWorkerSID = useFlexSelector((state) => state?.flex?.worker?.worker?.sid) || '';
  const agentFN = useFlexSelector((state) => state?.flex?.worker?.attributes?.full_name) || '';
  const selectedTaskSID = useFlexSelector((state) => state?.flex?.view?.selectedTaskSid) || '';

  // On click we will be pulling the conference SID, toggling the agent assistance button respectively,
  // and updating the sync doc with the agent's assistance status (either adding or removing them)
  const agentAssistanceClick = () => {
    const conference = task && task.conference;
    const conferenceSID = conference?.conferenceSid || '';
    if (agentAssistanceButton) {
      dispatch(
        Actions.setBargeCoachStatus({
          agentAssistanceButton: false,
        }),
      );
      // Caching this to help with browser refresh recovery
      localStorage.setItem('cacheAgentAssistState', 'false');

      // Updating the Sync Doc to remove the agent from the assistance array
      SyncDoc.initSyncDocAgentAssistance(agentWorkerSID, agentFN, conferenceSID, selectedTaskSID, 'remove');
    } else {
      dispatch(
        Actions.setBargeCoachStatus({
          agentAssistanceButton: true,
        }),
      );

      // Caching this if the browser is refreshed while the agent actively had agent assistance up
      // We will use this to clear up the Sync Doc and the Agent Alert
      localStorage.setItem('cacheAgentAssistState', 'true');

      // Updating the Sync Doc to add the agent from the assistance array
      SyncDoc.initSyncDocAgentAssistance(agentWorkerSID, agentFN, conferenceSID, selectedTaskSID, 'add');
    }
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
