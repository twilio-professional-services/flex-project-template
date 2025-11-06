import * as React from 'react';
import { Actions, IconButton, TaskHelper, ITask, templates } from '@twilio/flex-ui';

import { StringTemplates } from '../../flex-hooks/strings/Conference';

export interface OwnProps {
  task?: ITask;
}

const ConferenceButton = (props: OwnProps) => {
  const isLiveCall = props.task ? TaskHelper.isLiveCall(props.task) : false;

  const handleClick = () => {
    Actions.invokeAction('SetComponentState', {
      name: 'ConferenceDialog',
      state: { isOpen: true },
    });
  };

  return (
    <IconButton
      icon="Add"
      disabled={!isLiveCall}
      onClick={handleClick}
      variant="secondary"
      title={templates[StringTemplates.AddConferenceParticipant]()}
    />
  );
};

export default ConferenceButton;
