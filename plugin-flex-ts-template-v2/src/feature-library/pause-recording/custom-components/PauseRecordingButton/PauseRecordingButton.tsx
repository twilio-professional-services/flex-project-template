import React, { useEffect, useState } from 'react';
import {
  Actions,
  IconButton,
  TaskHelper,
  ITask
} from '@twilio/flex-ui';

import { pausedRecordings, pauseRecording, resumeRecording } from "../../helpers/pauseRecordingHelper";

export interface OwnProps {
  task?: ITask
}

const PauseRecordingButton = (props: OwnProps) => {
  const [ paused, setPaused ] = useState(false);
  const [ waiting, setWaiting ] = useState(false);
  
  const isLiveCall = props.task ? TaskHelper.isLiveCall(props.task) : false;
  
  useEffect(() => {
    if (!isLiveCall || !props.task) {
      return;
    }
    
    if (pausedRecordings && pausedRecordings.find((pausedRecording) => props.task && pausedRecording.reservationSid === props.task.sid)) {
      setPaused(true);
    }
  }, []);
  
  const handleClick = async () => {
    if (!isLiveCall || !props.task) {
      return;
    }
    
    setWaiting(true);
    
    if (paused) {
      const success = await resumeRecording(props.task);
      
      if (success) {
        setPaused(false);
      }
    } else {
      const success = await pauseRecording(props.task);
      
      if (success) {
        setPaused(true);
      }
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
