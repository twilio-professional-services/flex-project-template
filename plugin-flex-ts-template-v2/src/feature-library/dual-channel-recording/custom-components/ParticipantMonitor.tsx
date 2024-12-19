import { useEffect, useState } from 'react';
import { ITask } from '@twilio/flex-ui';

import { initiateRecording, getWorkerParticipant } from '../helpers/dualChannelHelper';

interface OwnProps {
  task?: ITask;
}

const ParticipantMonitor = ({ task }: OwnProps) => {
  const getAgentCallSid = (): string => {
    if (!task?.conference?.participants) return '';
    return getWorkerParticipant(task.conference.participants)?.callSid ?? '';
  };

  const [agentSid, setAgentSid] = useState(getAgentCallSid());
  const [reservationSid, setReservationSid] = useState(task?.sid ?? '');

  useEffect(() => {
    const newAgentSid = getAgentCallSid();

    if (newAgentSid && agentSid && newAgentSid !== agentSid && task?.sid === reservationSid) {
      // Agent participant SID changed.
      initiateRecording(task);
    }

    setAgentSid(newAgentSid);
  }, [task?.conference?.participants]);

  useEffect(() => {
    setReservationSid(task?.sid ?? '');
  }, [task?.sid]);

  return null;
};

export default ParticipantMonitor;
