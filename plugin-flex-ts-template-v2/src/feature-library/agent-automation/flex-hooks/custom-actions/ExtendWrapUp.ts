import { Actions, Manager, TaskHelper } from '@twilio/flex-ui';

import { getMatchingTaskConfiguration } from '../../config';
import { add, remove } from '../states/extendedWrapupSlice';

export const registerExtendWrapUpAction = async () => {
  Actions.registerAction('ExtendWrapUp', async (payload: { reservationSid: string; extend: boolean }) => {
    const { reservationSid, extend } = payload;
    const task = TaskHelper.getTaskByTaskSid(reservationSid);
    if (!task) return;

    const taskConfig = getMatchingTaskConfiguration(task);
    if (!taskConfig || !taskConfig.allow_extended_wrapup) return;

    Manager.getInstance().store.dispatch(extend ? add(task.sid) : remove(task.sid));
  });
};
