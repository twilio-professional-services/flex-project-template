import { Actions, ITask, Manager } from '@twilio/flex-ui';

import { getMatchingTaskConfiguration } from '../../config';
import { add, remove } from '../states/extendedWrapupSlice';

export const registerExtendWrapUpAction = async () => {
  Actions.registerAction('ExtendWrapUp', async (payload: { task: ITask; extend: boolean }) => {
    const { task, extend } = payload;
    if (!task) return;

    const taskConfig = getMatchingTaskConfiguration(task);
    if (!taskConfig || !taskConfig.allow_extended_wrapup) return;

    Manager.getInstance().store.dispatch(extend ? add(task.sid) : remove(task.sid));
  });
};
