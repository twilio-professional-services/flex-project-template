import * as Flex from '@twilio/flex-ui';

import { FlexEvent } from '../../../../types/feature-loader';
import AppState from '../../../../types/manager/AppState';
import { reduxNamespace } from '../../../../utils/state';
import { ExtendedWrapupState, remove } from '../states/extendedWrapupSlice';

export const eventName = FlexEvent.taskTimeout;
export const eventHook = async function resetExtendedWrapupAfterTimeout(
  flex: typeof Flex,
  manager: Flex.Manager,
  task: Flex.ITask,
) {
  const state = manager.store.getState() as AppState;
  const { extendedReservationSids } = state[reduxNamespace].extendedWrapup as ExtendedWrapupState;

  if (!task || !extendedReservationSids.includes(task.sid)) {
    return;
  }

  manager.store.dispatch(remove(task.sid));
};
