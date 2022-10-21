import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { AppState, reduxNamespace } from '../../../../flex-hooks/states';
import {
  IconButton,
  TaskHelper,
  ITask
} from '@twilio/flex-ui';

import { pauseRecording, resumeRecording } from "../../helpers/pauseRecordingHelper";

export interface OwnProps {
  task?: ITask
}

const PauseRecordingButton = (props: OwnProps) => {
  const [ paused, setPaused ] = useState(false);
  const [ waiting, setWaiting ] = useState(false);
  
  const { pausedRecordings } = useSelector((state: AppState) => state[reduxNamespace].pauseRecording);
  
  const isLiveCall = props.task ? TaskHelper.isLiveCall(props.task) : false;
  
  useEffect(() => {
    if (!isLiveCall || !props.task) {
      return;
    }
    
    updatePausedState();
  }, []);
  
  useEffect(() => {
    updatePausedState();
  }, [pausedRecordings]);
  
  const updatePausedState = () => {
    if (pausedRecordings && pausedRecordings.find((pausedRecording) => props.task && pausedRecording.reservationSid === props.task.sid)) {
      setPaused(true);
    } else {
      setPaused(false);
    }
  }
  
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
  }
  
  return (
    <IconButton
      icon="MonitorOffLarge"
      disabled={!isLiveCall || waiting}
      onClick={handleClick}
      variant={ paused ? "primary" : "secondary" }
      title={ paused ? "Resume Recording" : "Pause Recording" }
    />
  );
}

export default PauseRecordingButton;
