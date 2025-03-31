import { useState, useEffect } from 'react';
import { Actions, useFlexSelector, ITask, templates, ConversationState } from '@twilio/flex-ui';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@twilio-paste/core/box';
import { Button } from '@twilio-paste/core/button';
import { Flex } from '@twilio-paste/core/flex';

import { AppState } from '../../../../types/manager';
import { reduxNamespace } from '../../../../utils/state';
import { setBargeCoachStatus, SupervisorBargeCoachState } from '../../flex-hooks/states/SupervisorBargeCoachSlice';
import BargeCoachService from '../../utils/serverless/BargeCoachService';
import { StringTemplates } from '../../flex-hooks/strings/BargeCoachAssist';

type SupervisorChatBargeProps = {
  conversation?: ConversationState.ConversationState;
  task: ITask;
};

export const ChatBargeButton = ({ conversation, task }: SupervisorChatBargeProps) => {
  const dispatch = useDispatch();
  const [processing, setProcessing] = useState(false);

  const myWorkerName = useFlexSelector((state) => state?.flex?.session?.identity) || '';
  const myWorkerSid = useFlexSelector((state) => state?.flex?.worker?.worker?.sid) || '';
  const { bargedConversations } = useSelector(
    (state: AppState) => state[reduxNamespace].supervisorBargeCoach as SupervisorBargeCoachState,
  );

  const conversationSid = conversation?.source?.sid || '';
  const isJoined = conversation?.participants.has(myWorkerName) ?? false;
  const isLiveConversation =
    (task && conversation && task.status !== 'completed' && task.status !== 'wrapping') === true;

  const bargeHandleClick = async () => {
    if (!task || processing || !conversationSid) {
      return;
    }
    setProcessing(true);
    if (isJoined) {
      const result = await BargeCoachService.removeWorkerParticipant(conversationSid, myWorkerName);
      if (result) {
        const newBargedConversations = [...bargedConversations, conversationSid];
        dispatch(setBargeCoachStatus({ bargedConversations: newBargedConversations }));
        localStorage.setItem('bargedConversations', JSON.stringify(newBargedConversations));
      }
    } else {
      const result = await BargeCoachService.inviteWorkerParticipant(conversationSid, myWorkerName);
      if (result) {
        const newBargedConversations = bargedConversations.filter((sid) => sid !== conversationSid);
        dispatch(setBargeCoachStatus({ bargedConversations: newBargedConversations }));
        localStorage.setItem('bargedConversations', JSON.stringify(newBargedConversations));
      }
    }
    // Because of how the monitor panel renders, we need to close it and re-open it to show
    // we are part of the conversation
    await Actions.invokeAction('SelectTaskInSupervisor', { sid: null });
    Actions.invokeAction('SelectTaskInSupervisor', { sid: task.sid });
    setProcessing(false);
  };

  useEffect(() => {
    if (
      task &&
      conversationSid &&
      myWorkerSid !== task.workerSid &&
      isJoined &&
      (task.status === 'wrapping' || task.status === 'completed')
    ) {
      // TODO: Is this necessary? Should we use webhooks? What about Leave/Pause interaction support?
      // BargeCoachService.removeWorkerParticipant(conversationSid, myWorkerName);
    }
  }, [task]);

  if (task && myWorkerSid === task.workerSid) {
    return <></>;
  }

  return (
    <Flex hAlignContent="left" vertical>
      <Box padding="space10" element="BARGE_COACH_BUTTON_BOX">
        <Button
          variant="primary"
          size="small"
          onClick={bargeHandleClick}
          disabled={processing || conversation?.isLoadingParticipants || !isLiveConversation}
        >
          {isJoined ? templates[StringTemplates.Leave]() : templates[StringTemplates.Join]()}
        </Button>
      </Box>
    </Flex>
  );
};
