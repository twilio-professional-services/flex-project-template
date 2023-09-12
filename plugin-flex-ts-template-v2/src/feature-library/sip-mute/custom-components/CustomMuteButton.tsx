import { IconButton, TaskHelper, ITask, templates } from '@twilio/flex-ui';
import { StringTemplates } from '../flex-hooks/strings/Mute';
import { getLocalParticipantForTask } from '../helpers/CallControlHelper';
import CallControlService from '../helpers/CallControlService';
import { useEffect, useState } from 'react';

export interface OwnProps {
  task?: ITask;
}
const CustomMuteButton = (props: OwnProps) => {
  const [muted, setMuted] = useState(false);
  const isLiveCall = props.task ? TaskHelper.isLiveCall(props.task) : false;

  useEffect(() => {
    if (!props.task) return;
    const workerParticipant = getLocalParticipantForTask(props.task);

    if (workerParticipant) {
      setMuted(workerParticipant.muted);
    }
  }, [props.task?.conference, props.task?.conference?.participants]);

  const handleClick = async () => {
    if (!props.task) {
      console.error(`No task active`, props.task);
      return;
    }

    const conferenceSid = props.task?.conference?.conferenceSid || props.task?.attributes?.conference?.sid;
    if (!conferenceSid) {
      console.error(`No Conference SID`, props.task);
      return;
    }

    const participantCallSid = getLocalParticipantForTask(props.task);
    if (!participantCallSid) {
      console.error(`No Participant`, props.task);
      return;
    }

    if (muted) {
      await CallControlService.unmuteParticipant(conferenceSid, participantCallSid);
    } else {
      await CallControlService.muteParticipant(conferenceSid, participantCallSid);
    }
    setMuted(!muted);
  };

  return (
    <>
      <IconButton
        icon={muted ? 'MuteLargeBold' : 'MuteLarge'}
        disabled={!isLiveCall}
        onClick={handleClick}
        variant="secondary"
        title={templates[StringTemplates.MuteParticipant]()}
      />
    </>
  );
};

export default CustomMuteButton;
