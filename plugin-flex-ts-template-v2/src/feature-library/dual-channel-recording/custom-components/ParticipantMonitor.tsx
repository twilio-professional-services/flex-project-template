import { useEffect, useState } from 'react';
import { ITask } from '@twilio/flex-ui';

import { initiateRecording } from '../helpers/dualChannelHelper';

interface OwnProps {
  task?: ITask;
}

const ParticipantMonitor = ({ task }: OwnProps) => {
  const getAgentCallSid = () =>
    task?.conference?.participants
      .sort((a, b) => (b.mediaProperties?.sequenceNumber || 0) - (a.mediaProperties?.sequenceNumber || 0))
      .find((p) => p.isCurrentWorker && p.status === 'joined')?.callSid;

  const [agentSid, setAgentSid] = useState(getAgentCallSid() ?? '');
  const [reservationSid, setReservationSid] = useState(task?.sid ?? '');

  useEffect(() => {
    // stuff
    const newAgentSid = getAgentCallSid() ?? '';

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
