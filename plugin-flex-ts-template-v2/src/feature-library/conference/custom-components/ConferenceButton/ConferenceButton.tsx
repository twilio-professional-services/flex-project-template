import * as React from 'react';
import {
  Actions,
  IconButton,
  TaskHelper,
  ITask
} from '@twilio/flex-ui';

export interface OwnProps {
  task?: ITask
}

const ConferenceButton = (props: OwnProps) => {
  const isLiveCall = props.task ? TaskHelper.isLiveCall(props.task) : false;
  
  const handleClick = () => {
    Actions.invokeAction('SetComponentState', {
      name: 'ConferenceDialog',
      state: { isOpen: true }
    });
  }
  
  return (
    <IconButton
      icon="Add"
      disabled={!isLiveCall}
      onClick={handleClick}
      variant='secondary'
      title="Add Conference Participant"
    />
  );
}

export default ConferenceButton;
