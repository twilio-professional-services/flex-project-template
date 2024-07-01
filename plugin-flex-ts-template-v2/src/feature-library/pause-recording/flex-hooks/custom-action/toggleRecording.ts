import { Actions, ITask, Manager } from '@twilio/flex-ui';

import { PauseRecordingState } from '../states/PauseRecordingSlice';
import AppState from '../../../../types/manager/AppState';
import { reduxNamespace } from '../../../../utils/state';
import logger from '../../../../utils/logger';

export const registerToggleCallRecordingAction = async () => {
  Actions.registerAction('ToggleCallRecording', async (payload: { task?: ITask }) => {
    if (!payload || !payload.task) {
      logger.warn('[pause-recording] No task passed as payload, cannot pause/resume recording');
      return;
    }

    const state: AppState = Manager.getInstance().store.getState() as AppState;
    const { pausedRecordings } = state[reduxNamespace].pauseRecording as PauseRecordingState;

    if (
      pausedRecordings &&
      pausedRecordings.find((pausedRecording) => payload.task && pausedRecording.reservationSid === payload.task.sid)
    ) {
      await Actions.invokeAction('ResumeCallRecording', payload);
    } else {
      await Actions.invokeAction('PauseCallRecording', payload);
    }
  });
};
