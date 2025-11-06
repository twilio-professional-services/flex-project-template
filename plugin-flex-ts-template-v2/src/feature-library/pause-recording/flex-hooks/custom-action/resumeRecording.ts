import { Actions, ITask, TaskHelper } from '@twilio/flex-ui';

import { resumeRecording } from '../../helpers/pauseRecordingHelper';
import logger from '../../../../utils/logger';

export const registerResumeCallRecordingAction = async () => {
  Actions.registerAction('ResumeCallRecording', async (payload: { task?: ITask }) => {
    if (!payload || !payload.task) {
      logger.warn('[pause-recording] No task passed as payload, cannot resume recording');
      return;
    }

    const isLiveCall = payload.task ? TaskHelper.isLiveCall(payload.task) : false;

    if (!isLiveCall) {
      logger.warn('[pause-recording] Task is not a live call, cannot resume recording');
      return;
    }

    await resumeRecording(payload.task);
  });
};
