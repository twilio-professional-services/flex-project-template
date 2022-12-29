import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { AppState, reduxNamespace } from '../../../../flex-hooks/states';
import {
  IconButton,
  TaskHelper,
  ITask
} from '@twilio/flex-ui';

import { pauseRecording, resumeRecording } from "../../helpers/pauseRecordingHelper";
import PauseRecordingStrings, { StringTemplates } from '../../flex-hooks/strings/PauseRecording';

export interface OwnProps {
  task?: ITask
}

const PauseRecordingButton = (props: OwnProps) => {
  const [ paused, setPaused ] = useState(false);
  const [ waiting, setWaiting ] = useState(false);
  
  const { pausedRecordings } = useSelector((state: AppState) => state[reduxNamespace].pauseRecording);
  
  const isLiveCall = props.task ? TaskHelper.isLiveCall(props.task) : false;
  
  useEffect(() => {
    updatePausedState();
  }, []);
  
  useEffect(() => {
    updatePausedState();
  }, [pausedRecordings, props.task?.sid]);
  
  const updatePausedState = () => {
    if (!isLiveCall || !props.task) {
      setPaused(false);
      return;
    }
    
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
      title={ paused ? PauseRecordingStrings[StringTemplates.RESUME_TOOLTIP] : PauseRecordingStrings[StringTemplates.PAUSE_TOOLTIP] }
    />
  );
}

export default PauseRecordingButton;
