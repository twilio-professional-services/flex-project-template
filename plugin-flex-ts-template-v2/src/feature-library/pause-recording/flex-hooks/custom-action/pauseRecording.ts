import { Actions, ITask, TaskHelper } from '@twilio/flex-ui';

import { pauseRecording } from '../../helpers/pauseRecordingHelper';

export const registerPauseCallRecordingAction = async () => {
  Actions.registerAction('PauseCallRecording', async (payload: { task?: ITask }) => {
    if (!payload || !payload.task) {
      console.log('No current task passed as payload, cannot pause recording');
      return;
    }

    const isLiveCall = payload.task ? TaskHelper.isLiveCall(payload.task) : false;

    if (!isLiveCall) {
      console.log('Current task is not a live call, cannot pause recording');
      return;
    }

    pauseRecording(payload.task);
  });
};
