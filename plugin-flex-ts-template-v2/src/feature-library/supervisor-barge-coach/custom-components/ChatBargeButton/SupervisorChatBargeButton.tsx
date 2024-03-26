import * as React from 'react';
import * as Flex from '@twilio/flex-ui';
import { useFlexSelector, ITask, templates } from '@twilio/flex-ui';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@twilio-paste/core/box';
import { Button } from '@twilio-paste/core/button';
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
  const conversationSid = task?.attributes?.conversationSid || '';
  const [chatBargeStatus, setChatBargeStatus] = React.useState(false);
  // Storing teamViewPath to browser cache to help if a refresh happens
  // will use this in the browserRefreshHelper
  if (teamViewTaskSID && agentWorkerSID) {
    localStorage.setItem('teamViewTaskSID', teamViewTaskSID);
    localStorage.setItem('agentWorkerSID', agentWorkerSID);
  }
  const bargeHandleClick = async () => {
    setProcessing(true);
    if (!teamViewTaskSID) {
      setProcessing(false);
      return;
    }
    if (chatBargeStatus) {
      await BargeCoachService.removeWorkerParticipant(conversationSid, myWorkerName);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [teamViewTaskSID]: value, ...newChatBargeState } = chatBarge;
      dispatch(Actions.setBargeCoachStatus({ chatBarge: newChatBargeState }));
      setChatBargeStatus(false);
      // Storing chatBarge to browser cache to help if a refresh happens
      // will use this in the browserRefreshHelper
      localStorage.setItem('chatBarge', JSON.stringify(newChatBargeState));
    } else {
      await BargeCoachService.inviteWorkerParticipant(conversationSid, myWorkerName);
      const newChatBargeState = { ...chatBarge, [teamViewTaskSID]: true };
      dispatch(Actions.setBargeCoachStatus({ chatBarge: newChatBargeState }));
      setChatBargeStatus(true);
      // Storing chatBarge to browser cache to help if a refresh happens
      // will use this in the browserRefreshHelper
      localStorage.setItem('chatBarge', JSON.stringify(newChatBargeState));
    }
    await Flex.Actions.invokeAction('SelectTaskInSupervisor', { sid: null });
    Flex.Actions.invokeAction('SelectTaskInSupervisor', { sid: teamViewTaskSID });
    setProcessing(false);
  };
  React.useEffect(() => {
    const checkSupervisorInChat = async () => {
      if (teamViewTaskSID in chatBarge) {
        setChatBargeStatus(chatBarge[teamViewTaskSID]);
      } else {
        setIsChecking(true);
        try {
          const supervisorInChat = await BargeCoachService.workerPartOfConversation(conversationSid, myWorkerName);
          // If supervisor is in the chat, update the barge state.
          if (supervisorInChat) {
            if (!teamViewTaskSID) {
              setIsChecking(false);
              return;
            }
            const newChatBargeState = { ...chatBarge, [teamViewTaskSID]: true };
            dispatch(Actions.setBargeCoachStatus({ chatBarge: newChatBargeState }));
            setChatBargeStatus(true);
            localStorage.setItem('chatBarge', JSON.stringify(newChatBargeState));
          } else {
            setChatBargeStatus(false);
          }
        } catch (err) {
          console.error('Failed to fetch chat participants:', err);
          setChatBargeStatus(false);
        }
        setIsChecking(false);
      }
    };
    checkSupervisorInChat();
  }, [teamViewTaskSID, chatBarge]);

  React.useEffect(() => {
    if (chatBargeStatus && (task.status === 'wrapping' || task.status === 'completed')) {
      console.log('Attempting to remove worker from conversation');
      BargeCoachService.removeWorkerParticipant(conversationSid, myWorkerName);
      setChatBargeStatus(false);
    }
  }, [task]);

  const isLiveConversation = (task: ITask): boolean =>
    task !== null && task.status !== 'completed' && task.status !== 'wrapping';

  return (
    <FlexBox hAlignContent="left" vertical>
      <Box padding="space10" element="BARGE_COACH_BUTTON_BOX">
        <Button
          variant="primary"
          size="small"
          onClick={bargeHandleClick}
          disabled={processing || isChecking || !isLiveConversation(task)}
        >
          {processing
            ? chatBargeStatus
              ? templates[StringTemplates.Leaving]()
              : templates[StringTemplates.Joining]()
            : chatBargeStatus
            ? templates[StringTemplates.Leave]()
            : templates[StringTemplates.Join]()}
        </Button>
      </Box>
    </FlexBox>
  );
};
