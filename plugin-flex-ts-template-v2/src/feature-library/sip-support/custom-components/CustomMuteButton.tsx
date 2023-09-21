import { IconButton, TaskHelper, ITask, templates } from '@twilio/flex-ui';
import { useEffect, useState } from 'react';

import { getConferenceSidFromTask, getLocalParticipantForTask } from '../helpers/CallControlHelper';
import CallControlService from '../helpers/CallControlService';

export interface OwnProps {
  task?: ITask;
  renderAsLink: boolean;
}
const CustomMuteButton = (props: OwnProps) => {
  const isLiveCall = props.task ? TaskHelper.isLiveCall(props.task) : false;
  const [muted, setMuted] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!props.task?.conference) return;
    const workerParticipant = props.task.conference.participants.find((p) => p.isCurrentWorker);

    if (workerParticipant) {
      setMuted(workerParticipant.muted);
    }

    setPending(false);
  }, [props.task?.conference, props.task?.conference?.participants]);

  const handleClick = async () => {
    if (!props.task) {
      console.error(`No task active`, props.task);
      return;
    }

    const conferenceSid = getConferenceSidFromTask(props.task);
    if (!conferenceSid) {
      console.error(`No Conference SID`, props.task);
      return;
    }

    const participantCallSid = getLocalParticipantForTask(props.task);
    if (!participantCallSid) {
      console.error(`No Participant`, props.task);
      return;
    }

    setPending(true);
    // Note that it may seem redundant to set the mute state here as well as above
    // however it is set here to support the scenario where Flex UI has been refreshed
    // during an active call, which means there will be no state in Redux
    // This should not occur generally but if it does this will resolve the UI mute state
    if (muted) {
      CallControlService.unmuteParticipant(conferenceSid, participantCallSid)
        .then(() => setMuted(false))
        .finally(() => setPending(false));
    } else {
      CallControlService.muteParticipant(conferenceSid, participantCallSid)
        .then(() => setMuted(true))
        .finally(() => setPending(false));
    }
  };

  return props.renderAsLink ? (
    <div onClick={handleClick}>{muted ? templates.UnmuteAriaLabel() : templates.MuteButtonAriaLabel()}</div>
  ) : (
    <IconButton
      icon={muted ? 'MuteLargeBold' : 'MuteLarge'}
      disabled={!isLiveCall || pending}
      onClick={handleClick}
      variant="secondary"
      title={muted ? templates.UnmuteAriaLabel() : templates.MuteButtonAriaLabel()}
    />
  );
};

export default CustomMuteButton;
