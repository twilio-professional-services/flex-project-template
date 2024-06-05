import { Actions, ITask, TaskHelper } from '@twilio/flex-ui';

import { resumeRecording } from '../../helpers/pauseRecordingHelper';

export const registerResumeCallRecordingAction = async () => {
  Actions.registerAction('ResumeCallRecording', async (payload: { task?: ITask }) => {
    if (!payload || !payload.task) {
      console.log('No task passed as payload, cannot resume recording');
      return;
    }

    const isLiveCall = payload.task ? TaskHelper.isLiveCall(payload.task) : false;

    if (!isLiveCall) {
      console.log('Task is not a live call, cannot resume recording');
      return;
    }

    await resumeRecording(payload.task);
  });
};
