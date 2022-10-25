import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { AppState, reduxNamespace } from '../../../../flex-hooks/states';
import {
  TaskHelper,
  ITask
} from '@twilio/flex-ui';
import {Text} from '@twilio-paste/core/text';
import PauseRecordingStrings, { StringTemplates } from '../../flex-hooks/strings/PauseRecording';

export interface OwnProps {
  task?: ITask
}

const PauseStatusPanel = (props: OwnProps) => {
  const [ paused, setPaused ] = useState(false);
  
  const { pausedRecordings } = useSelector((state: AppState) => state[reduxNamespace].pauseRecording);
  
  useEffect(() => {
    updatePausedState();
  }, []);
  
  useEffect(() => {
    updatePausedState();
  }, [pausedRecordings, props.task?.sid]);
  
  const updatePausedState = () => {
    const isLiveCall = props.task ? TaskHelper.isLiveCall(props.task) : false;
    
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
  
  return (
    <>
    { paused && (
      <Text
        as='p'
        textAlign='center'
        fontWeight='fontWeightBold'
        padding='space50'>{PauseRecordingStrings[StringTemplates.RECORDING_PAUSED_LABEL]}</Text>
    )}
    </>
  );
}

export default PauseStatusPanel;
