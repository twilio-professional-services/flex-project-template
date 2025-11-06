import { TaskHelper, ITask, Template, templates } from '@twilio/flex-ui';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Text } from '@twilio-paste/core/text';

import AppState from '../../../../types/manager/AppState';
import { reduxNamespace } from '../../../../utils/state';
import { StringTemplates } from '../../flex-hooks/strings/PauseRecording';
import { PauseRecordingState } from '../../flex-hooks/states/PauseRecordingSlice';

export interface OwnProps {
  task?: ITask;
}

const PauseStatusPanel = (props: OwnProps) => {
  const [paused, setPaused] = useState(false);

  const { pausedRecordings } = useSelector(
    (state: AppState) => state[reduxNamespace].pauseRecording as PauseRecordingState,
  );

  const updatePausedState = () => {
    const isLiveCall = props.task ? TaskHelper.isLiveCall(props.task) : false;

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

  return (
    <>
      {paused && (
        <Text as="p" textAlign="center" fontWeight="fontWeightBold" padding="space50">
          <Template source={templates[StringTemplates.RECORDING_PAUSED_LABEL]} />
        </Text>
      )}
    </>
  );
};

export default PauseStatusPanel;
