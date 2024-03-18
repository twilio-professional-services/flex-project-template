import * as React from 'react';
import * as Flex from '@twilio/flex-ui';
import { useFlexSelector, ITask, templates } from '@twilio/flex-ui';
import { useDispatch, useSelector } from 'react-redux';
import { Stack } from '@twilio-paste/core/stack';
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
  const { chatBarge } = useSelector(
    (state: AppState) => state[reduxNamespace].supervisorBargeCoach as SupervisorBargeCoachState,
  );

  const teamViewTaskSID = useFlexSelector((state) => state?.flex?.view?.selectedTaskInSupervisorSid) || '';
  const agentWorkerSID = useFlexSelector((state) => state?.flex?.supervisor?.stickyWorker?.worker?.sid) || '';
  const myWorkerName = useFlexSelector((state) => state?.flex?.worker?.worker?.name) || '';
  const conversationSid = task?.attributes?.conversationSid || '';
  const [chatBargeStatus, setChatBargeStatus] = React.useState(false);

  // Storing teamViewPath to browser cache to help if a refresh happens
  // will use this in the browserRefreshHelper
  if (teamViewTaskSID && agentWorkerSID) {
    localStorage.setItem('teamViewTaskSID', teamViewTaskSID);
    localStorage.setItem('agentWorkerSID', agentWorkerSID);
  }
  const newChatBargeState = { ...chatBarge, [teamViewTaskSID]: !chatBargeStatus };
  const bargeHandleClick = async () => {
    setProcessing(true);
    if (chatBargeStatus) {
      await BargeCoachService.removeWorkerParticipant(conversationSid, myWorkerName);
      dispatch(Actions.setBargeCoachStatus({ chatBarge: newChatBargeState }));
      setChatBargeStatus(false);
      // Storing chatBarge to browser cache to help if a refresh happens
      // will use this in the browserRefreshHelper
      localStorage.setItem('chatBarge', JSON.stringify(newChatBargeState));
    } else {
      await BargeCoachService.inviteWorkerParticipant(conversationSid, myWorkerName);
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
    if (teamViewTaskSID in chatBarge) {
      setChatBargeStatus(chatBarge[teamViewTaskSID]);
    } else {
      setChatBargeStatus(false);
    }
  }, [teamViewTaskSID, chatBarge]);

  return (
    <FlexBox hAlignContent="left" vertical>
      <Stack orientation="horizontal" spacing="space30" element="BARGE_COACH_BUTTON_BOX">
        <Button variant="primary" size="small" onClick={bargeHandleClick} disabled={processing}>
          {processing
            ? chatBargeStatus
              ? templates[StringTemplates.Leaving]()
              : templates[StringTemplates.Joining]()
            : chatBargeStatus
            ? templates[StringTemplates.Leave]()
            : templates[StringTemplates.Join]()}
        </Button>
      </Stack>
    </FlexBox>
  );
};
