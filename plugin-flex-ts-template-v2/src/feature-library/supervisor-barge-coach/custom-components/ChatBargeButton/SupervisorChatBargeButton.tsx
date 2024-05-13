import * as React from 'react';
import * as Flex from '@twilio/flex-ui';
import { useFlexSelector, ITask, templates, StateHelper } from '@twilio/flex-ui';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@twilio-paste/core/box';
import { Button } from '@twilio-paste/core/button';
import { Tooltip } from '@twilio-paste/core/tooltip';
import { Flex as FlexBox } from '@twilio-paste/core/flex';

import { AppState } from '../../../../types/manager';
import { reduxNamespace } from '../../../../utils/state';
import { Actions, SupervisorBargeCoachState } from '../../flex-hooks/states/SupervisorBargeCoach';
import BargeCoachService from '../../utils/serverless/BargeCoachService';
import { StringTemplates } from '../../flex-hooks/strings/BargeCoachAssist';

type SupervisorChatBargeProps = {
  task: ITask;
};

export const SupervisorChatBargeButton = ({ task }: SupervisorChatBargeProps) => {
  const dispatch = useDispatch();
  const [processing, setProcessing] = React.useState(false);
  const [isChecking, setIsChecking] = React.useState(false);
  const { chatBarge } = useSelector(
    (state: AppState) => state[reduxNamespace].supervisorBargeCoach as SupervisorBargeCoachState,
  );
  const teamViewTaskSID = useFlexSelector((state) => state?.flex?.view?.selectedTaskInSupervisorSid) || '';
  const agentWorkerSID = useFlexSelector((state) => state?.flex?.supervisor?.stickyWorker?.worker?.sid) || '';
  const myWorkerName = useFlexSelector((state) => state?.flex?.session?.identity) || '';
  const myWorkerSid = useFlexSelector((state) => state?.flex?.worker?.worker?.sid) || '';
  const conversationState = StateHelper.getConversationStateForTask(task) || null;
  const conversationSid = task?.attributes?.conversationSid || '';
  const [chatBargeStatus, setChatBargeStatus] = React.useState(false);
  // Storing teamViewPath to browser cache to help if a refresh happens
  // will use this in the browserRefreshHelper
  if (teamViewTaskSID && agentWorkerSID) {
    localStorage.setItem('teamViewTaskSID', teamViewTaskSID);
    localStorage.setItem('agentWorkerSID', agentWorkerSID);
  }
  const bargeHandleClick = async () => {
    if (!teamViewTaskSID || processing) {
      return;
    }
    setProcessing(true);
    if (chatBarge[teamViewTaskSID]) {
      await BargeCoachService.removeWorkerParticipant(conversationSid, myWorkerName);
      const { [teamViewTaskSID]: value, ...newChatBargeState } = chatBarge;
      dispatch(Actions.setBargeCoachStatus({ chatBarge: newChatBargeState }));
      localStorage.setItem('chatBarge', JSON.stringify(newChatBargeState));
    } else {
      await BargeCoachService.inviteWorkerParticipant(conversationSid, myWorkerName);
      const newChatBargeState = { ...chatBarge, [teamViewTaskSID]: conversationSid };
      dispatch(Actions.setBargeCoachStatus({ chatBarge: newChatBargeState }));
      localStorage.setItem('chatBarge', JSON.stringify(newChatBargeState));
    }
    // Because of how the monitor panel renders, we need to close it and re-open it to show
    // we are part of the conversation
    console.warn('teamViewTaskSID', teamViewTaskSID);
    await Flex.Actions.invokeAction('SelectTaskInSupervisor', { sid: null });
    Flex.Actions.invokeAction('SelectTaskInSupervisor', { sid: teamViewTaskSID });
    setProcessing(false);
  };
  React.useEffect(() => {
    // If the supervisor closes or refreshes their browser, we need to check if they are still in the chat
    // First will check if we have it from the redux value, otherwise let's check the conversation state itself
    const checkSupervisorInChat = async () => {
      if (teamViewTaskSID in chatBarge) {
        setIsChecking(true);
        let supervisorInChat = false;
        if (conversationState && !conversationState.isLoadingParticipants) {
          supervisorInChat = conversationState.participants.has(myWorkerName);
          if (supervisorInChat) {
            setChatBargeStatus(true);
          } else {
            const { [teamViewTaskSID]: value, ...newChatBargeState } = chatBarge;
            dispatch(Actions.setBargeCoachStatus({ chatBarge: newChatBargeState }));
            localStorage.setItem('chatBarge', JSON.stringify(newChatBargeState));
            setChatBargeStatus(false);
          }
        }
        setIsChecking(false);
      } else {
        setChatBargeStatus(false);
      }
    };
    checkSupervisorInChat();
  }, [teamViewTaskSID, chatBarge, conversationState]);

  React.useEffect(() => {
    if (chatBargeStatus && (task.status === 'wrapping' || task.status === 'completed')) {
      BargeCoachService.removeWorkerParticipant(conversationSid, myWorkerName);
      setChatBargeStatus(false);
    }
  }, [task]);

  const isLiveConversation = (task: ITask): boolean =>
    task !== null && task.status !== 'completed' && task.status !== 'wrapping' && myWorkerSid !== agentWorkerSID;

  // Returning two options, if it's disabled due to the supervisor being assigned the task
  // we want a hover text explaing why, otherwise don't do any Tooltip
  return (
    <FlexBox hAlignContent="left" vertical>
      {myWorkerSid === agentWorkerSID ? (
        <Tooltip placement="right" text={templates[StringTemplates.TaskAssignedToYou]()}>
          <Box padding="space10" element="BARGE_COACH_BUTTON_BOX">
            <Button
              variant="primary"
              size="small"
              onClick={bargeHandleClick}
              disabled={true} // always disabled when condition is met
            >
              {templates[StringTemplates.Join]()}
            </Button>
          </Box>
        </Tooltip>
      ) : (
        <Box padding="space10" element="BARGE_COACH_BUTTON_BOX">
          <Button
            variant="primary"
            size="small"
            onClick={bargeHandleClick}
            disabled={processing || isChecking || !isLiveConversation(task)}
          >
            {processing
              ? templates[StringTemplates.Joining]()
              : chatBarge[teamViewTaskSID]
              ? templates[StringTemplates.Leave]()
              : templates[StringTemplates.Join]()}
          </Button>
        </Box>
      )}
    </FlexBox>
  );
};
