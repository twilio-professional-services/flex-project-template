import * as Flex from '@twilio/flex-ui';

import AppState from '../../../../types/manager/AppState';
import { FlexActionEvent, FlexAction } from '../../../../types/feature-loader';
import { reduxNamespace } from '../../../../utils/state';
import { isAutoSelectTaskEnabled } from '../../config';

export interface EventPayload {
  task?: Flex.ITask;
  sid?: string;
}

export const actionEvent = FlexActionEvent.before;
export const actionName = FlexAction.SelectTask;
// when an outbound call back completes, select the parent task that initiated it
export const actionHook = async function autoSelectCallbackTaskWhenEndingCall(
  flex: typeof Flex,
  manager: Flex.Manager,
) {
  if (!isAutoSelectTaskEnabled()) return;

  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload: EventPayload, abortFunction: () => void) => {
    // when a reservation is removed from state, Flex runs SelectTask with task set to null
    // this means that when an outbound call back to a contact is completed (or canceled)
    // we need to catch that here in order to select the callback task

    // we only care if a null task is being selected
    if (payload.task || payload.sid) return;

    const state = manager.store.getState() as AppState;

    // we only care if a task was selected before this event occurred
    if (!state.flex.view.selectedTaskSid) return;

    // we need the previous reservation in state in order to select it
    const parentTask = state[reduxNamespace].callbackAndVoicemail.lastPlacedReservationSid;
    if (!parentTask) return;

    // make sure the parent task is still here
    if (!state.flex.worker.tasks.get(parentTask)) return;

    // cancel this action and select the parent task instead
    abortFunction();
    await flex.Actions.invokeAction(actionName, {
      sid: parentTask,
    });
  });
};
