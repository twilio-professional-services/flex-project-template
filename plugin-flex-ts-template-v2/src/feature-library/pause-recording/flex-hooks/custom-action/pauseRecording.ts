import { Actions, ITask, TaskHelper } from '@twilio/flex-ui';

import { pauseRecording } from '../../helpers/pauseRecordingHelper';
import logger from '../../../../utils/logger';

export const registerPauseCallRecordingAction = async () => {
  Actions.registerAction('PauseCallRecording', async (payload: { task?: ITask }) => {
    if (!payload || !payload.task) {
      logger.warn('[pause-recording] No task passed as payload, cannot pause recording');
      return;
    }

    const isLiveCall = payload.task ? TaskHelper.isLiveCall(payload.task) : false;

    if (!isLiveCall) {
      logger.warn('[pause-recording] Task is not a live call, cannot pause recording');
      return;
    }

    await pauseRecording(payload.task);
  });
};
