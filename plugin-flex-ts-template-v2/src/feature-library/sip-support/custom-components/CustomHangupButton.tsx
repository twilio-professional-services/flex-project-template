import { IconButton, TaskHelper, ITask, templates } from '@twilio/flex-ui';
import { useEffect, useState } from 'react';

import { getLocalParticipantForTask } from '../helpers/CallControlHelper';
import CallControlService from '../helpers/CallControlService';

export interface OwnProps {
  task?: ITask;
}
const CustomHangupButton = (props: OwnProps) => {
  const isLiveCall = props.task ? TaskHelper.isLiveCall(props.task) : false;
  const [pending, setPending] = useState(false);

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

    setPending(true);

    CallControlService.removeParticipant(conferenceSid, participantCallSid).finally(() => setPending(false));
  };

  return (
    <IconButton
      icon={'Hangup'}
      disabled={!isLiveCall || pending}
      onClick={handleClick}
      variant="secondary"
      title={templates.HangupCallTooltip()}
    />
  );
};

export default CustomHangupButton;
