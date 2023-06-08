import { IconButton, TaskHelper, ITask, templates } from '@twilio/flex-ui';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import AppState from '../../../../types/manager/AppState';
import { reduxNamespace } from '../../../../utils/state';
import { pauseRecording, resumeRecording } from '../../helpers/pauseRecordingHelper';
import { StringTemplates } from '../../flex-hooks/strings/PauseRecording';
import { PauseRecordingState } from '../../flex-hooks/states/PauseRecordingSlice';

export interface OwnProps {
  task?: ITask;
}

const PauseRecordingButton = (props: OwnProps) => {
  const [paused, setPaused] = useState(false);
  const [waiting, setWaiting] = useState(false);

  const { pausedRecordings } = useSelector(
    (state: AppState) => state[reduxNamespace].pauseRecording as PauseRecordingState,
  );

  const isLiveCall = props.task ? TaskHelper.isLiveCall(props.task) : false;

  const updatePausedState = () => {
    if (!isLiveCall || !props.task) {
      setPaused(false);
      return;
    }

    if (
      pausedRecordings &&
      pausedRecordings.find((pausedRecording) => props.task && pausedRecording.reservationSid === props.task.sid)
    ) {
      setPaused(true);
    } else {
      setPaused(false);
    }
  };

  useEffect(() => {
    updatePausedState();
  }, []);

  useEffect(() => {
    updatePausedState();
  }, [pausedRecordings, props.task?.sid]);

  const handleClick = async () => {
    if (!isLiveCall || !props.task) {
      return;
    }

    setWaiting(true);

    if (paused) {
      await resumeRecording(props.task);
    } else {
      await pauseRecording(props.task);
    }

    setWaiting(false);
  };

  return (
    <IconButton
      icon="MonitorOffLarge"
      disabled={!isLiveCall || waiting}
      onClick={handleClick}
      variant={paused ? 'primary' : 'secondary'}
      title={paused ? templates[StringTemplates.RESUME_TOOLTIP]() : templates[StringTemplates.PAUSE_TOOLTIP]()}
    />
  );
};

export default PauseRecordingButton;
