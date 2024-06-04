import { Actions, ITask, Manager, TaskHelper } from '@twilio/flex-ui';

import { PauseRecordingState } from '../states/PauseRecordingSlice';
import AppState from '../../../../types/manager/AppState';
import { reduxNamespace } from '../../../../utils/state';

export const registerToggleCallRecordingAction = async () => {
  Actions.registerAction('ToggleCallRecording', async (payload: { task?: ITask }) => {
    if (!payload || !payload.task) {
      console.log('No current task passed as payload, cannot pause/resume recording');
      return;
    }

    const isLiveCall = payload.task ? TaskHelper.isLiveCall(payload.task) : false;

    if (!isLiveCall) {
      console.log('Current task is not a live call, cannot pause/resume recording');
      return;
    }

    const state: AppState = Manager.getInstance().store.getState() as AppState;
    const { pausedRecordings } = state[reduxNamespace].pauseRecording as PauseRecordingState;

    if (
      pausedRecordings &&
      pausedRecordings.find((pausedRecording) => payload.task && pausedRecording.reservationSid === payload.task.sid)
    ) {
      Actions.invokeAction('ResumeCallRecording', payload);
    } else {
      Actions.invokeAction('PauseCallRecording', payload);
    }
  });
};
