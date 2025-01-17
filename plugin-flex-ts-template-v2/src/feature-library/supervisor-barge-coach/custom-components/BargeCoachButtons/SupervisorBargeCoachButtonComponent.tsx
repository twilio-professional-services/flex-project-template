import { useEffect, useState } from 'react';
import { TaskHelper, useFlexSelector, ITask, templates, Template } from '@twilio/flex-ui';
import { useSelector } from 'react-redux';
import { Flex } from '@twilio-paste/core/flex';
import { Stack } from '@twilio-paste/core/stack';
import { Button } from '@twilio-paste/core/button';
import { ButtonGroup } from '@twilio-paste/core/button-group';
import { AgentIcon } from '@twilio-paste/icons/esm/AgentIcon';
import { CallAddIcon } from '@twilio-paste/icons/esm/CallAddIcon';
import { MicrophoneOffIcon } from '@twilio-paste/icons/esm/MicrophoneOffIcon';
import { ParticipantTypes } from '@twilio/flex-ui/src/state/Participants/participants.types';

import { AppState } from '../../../../types/manager';
import { reduxNamespace } from '../../../../utils/state';
import { StringTemplates } from '../../flex-hooks/strings/BargeCoachAssist';
import { SupervisorBargeCoachState } from '../../flex-hooks/states/SupervisorBargeCoachSlice';
import { enterBargeMode, enterCoachMode, enterListenMode } from '../../helpers/bargeCoachHelper';

type SupervisorBargeCoachProps = {
  task: ITask;
};

export const SupervisorBargeCoachButtons = ({ task }: SupervisorBargeCoachProps) => {
  const [bargeCoachMode, setBargeCoachMode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { muted, coaching } = useSelector(
    (state: AppState) => state[reduxNamespace].supervisorBargeCoach as SupervisorBargeCoachState,
  );

  const myWorkerSID = useFlexSelector((state) => state?.flex?.worker?.worker?.sid) || '';
  const monitoringState = useFlexSelector((state) => state?.flex?.supervisor?.callMonitoring?.status) || 0;
  const monitoringTask = useFlexSelector((state) => state?.flex?.supervisor?.callMonitoring?.task);

  const isMonitoringThisTask = monitoringState === 2 && monitoringTask?.sid === task?.sid;

  useEffect(() => {
    if (!isMonitoringThisTask) {
      setBargeCoachMode('');
    } else if (muted && !coaching) {
      setBargeCoachMode('monitoring');
    } else if (!muted && !coaching) {
      setBargeCoachMode('barge');
    } else if (!muted && coaching) {
      setBargeCoachMode('coaching');
    }
  }, [muted, coaching, monitoringState, monitoringTask]);

  const getParticipantSid = (): string | undefined => {
    const conference = task && task.conference;

    // Checking the conference within the task for a participant with the value "supervisor",
    // is their status "joined", reason for this is every time you click monitor/unmonitor on a call
    // it creates an additional participant, the previous status will show as "left", we only want the active supervisor,
    // and finally we want to ensure that the supervisor that is joined also matches their worker_sid
    const supervisorParticipant = conference?.source.channelParticipants.find(
      (p) =>
        p.type === ('supervisor' as ParticipantTypes) &&
        p.mediaProperties.status === 'joined' &&
        myWorkerSID === p.routingProperties.workerSid,
    );
    return supervisorParticipant?.participantSid;
  };

  const setBargeCoach = async (mode: string) => {
    if (mode === bargeCoachMode) {
      return;
    }

    const conference = task && task.conference;
    const conferenceSid = conference?.conferenceSid;
    if (!conferenceSid) {
      return;
    }
    const participantSid = getParticipantSid();
    if (!participantSid) {
      return;
    }

    setIsLoading(true);

    switch (mode) {
      case 'barge': {
        // Barge-in will "unmute" their line if the are muted and disable coaching if enabled
        const agentParticipant = conference?.participants.find(
          (p) => p.participantType === 'worker' && monitoringTask?.workerSid === p.workerSid,
        );
        const agentSid = agentParticipant?.callSid;
        if (!agentSid) {
          setIsLoading(false);
          return;
        }
        await enterBargeMode(conferenceSid, participantSid, agentSid);
        break;
      }
      case 'coaching': {
        // Coaching will "unmute" their line if the are muted and coach the specific agent using their call SID
        const agentParticipant = conference?.participants.find(
          (p) => p.participantType === 'worker' && monitoringTask?.workerSid === p.workerSid,
        );
        const agentSid = agentParticipant?.callSid;
        if (!agentSid) {
          setIsLoading(false);
          return;
        }
        await enterCoachMode(conferenceSid, participantSid, agentSid);
        break;
      }
      case 'monitoring':
        // Mute their line and disable coaching
        await enterListenMode(conferenceSid, participantSid);
        break;
      default:
        break;
    }

    setIsLoading(false);
  };

  // Return the coach and barge-in buttons, disable if the call isn't live or
  // if the supervisor isn't monitoring the call, toggle the icon based on coach and barge-in status
  const isLiveCall = TaskHelper.isLiveCall(task);

  // Using a ButtonGroup rather than a RadioButtonGroup because RadioButtonGroup does not re-render when the value changes
  return (
    <Flex hAlignContent="center" vertical paddingBottom="space30">
      <Stack orientation="horizontal" spacing="space30" element="BARGE_COACH_BUTTON_BOX">
        <ButtonGroup attached id="barge-coach-mode">
          <Button
            variant="secondary"
            pressed={isMonitoringThisTask && bargeCoachMode === 'monitoring'}
            onClick={async () => setBargeCoach('monitoring')}
            disabled={!isMonitoringThisTask || !isLiveCall || isLoading}
          >
            <MicrophoneOffIcon decorative={true} />
            <Template source={templates[StringTemplates.Listen]} />
          </Button>
          <Button
            variant="secondary"
            pressed={isMonitoringThisTask && bargeCoachMode === 'barge'}
            onClick={async () => setBargeCoach('barge')}
            disabled={!isMonitoringThisTask || !isLiveCall || isLoading}
          >
            <CallAddIcon decorative={true} />
            <Template source={templates[StringTemplates.Barge]} />
          </Button>
          <Button
            variant="secondary"
            pressed={isMonitoringThisTask && bargeCoachMode === 'coaching'}
            onClick={async () => setBargeCoach('coaching')}
            disabled={!isMonitoringThisTask || !isLiveCall || isLoading}
          >
            <AgentIcon decorative={true} />
            <Template source={templates[StringTemplates.Coach]} />
          </Button>
        </ButtonGroup>
      </Stack>
    </Flex>
  );
};
