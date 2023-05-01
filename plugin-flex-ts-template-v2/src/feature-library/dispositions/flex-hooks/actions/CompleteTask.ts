import * as Flex from '@twilio/flex-ui';

import { getDispositionsForQueue, isNotesEnabled, isRequireDispositionEnabledForQueue } from '../../config';
import AppState from '../../../../types/manager/AppState';
import { reduxNamespace } from '../../../../utils/state';
import { DispositionsState } from '../states';
import { FlexActionEvent, FlexAction } from '../../../../types/feature-loader';
import { DispositionsNotification } from '../notifications';
import TaskRouterService from '../../../../utils/serverless/TaskRouter/TaskRouterService';

const handleAbort = (flex: typeof Flex, abortFunction: any) => {
  flex.Notifications.showNotification(DispositionsNotification.DispositionRequired);

  flex.Actions.invokeAction('SetComponentState', {
    name: 'AgentTaskCanvasTabs',
    state: { selectedTabName: 'disposition' },
  });

  abortFunction();
};

export const actionEvent = FlexActionEvent.before;
export const actionName = FlexAction.CompleteTask;
export const actionHook = function setDispositionBeforeCompleteTask(flex: typeof Flex, manager: Flex.Manager) {
  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload, abortFunction) => {
    if (!payload.task?.taskSid) {
      return;
    }

    const numDispositions = getDispositionsForQueue(payload.task?.queueSid ?? '').length;

    // If notes disabled, and no dispositions are configured, return.
    if (numDispositions < 1 && !isNotesEnabled()) {
      return;
    }

    // First, check if a disposition and/or notes are set.
    const { tasks } = (manager.store.getState() as AppState)[reduxNamespace].dispositions as DispositionsState;

    if (!tasks || !tasks[payload.task.taskSid]) {
      if (isRequireDispositionEnabledForQueue(payload.task.queueSid) && numDispositions > 0) {
        handleAbort(flex, abortFunction);
      }
      return;
    }

    const taskDisposition = tasks[payload.task.taskSid];
    let newConvAttributes = {};

    if (
      isRequireDispositionEnabledForQueue(payload.task.queueSid) &&
      !taskDisposition.disposition &&
      numDispositions > 0
    ) {
      handleAbort(flex, abortFunction);
      return;
    }

    if (!taskDisposition.disposition && (!isNotesEnabled() || !taskDisposition.notes)) {
      // Nothing for us to do, and it's okay!
      return;
    }

    if (taskDisposition.disposition) {
      newConvAttributes = {
        ...newConvAttributes,
        outcome: taskDisposition.disposition,
      };
    }

    if (isNotesEnabled() && taskDisposition.notes) {
      newConvAttributes = {
        ...newConvAttributes,
        content: taskDisposition.notes,
      };
    }

    try {
      await TaskRouterService.updateTaskAttributes(
        payload.task.taskSid,
        {
          conversations: newConvAttributes,
        },
        true,
      );
    } catch (error) {
      console.log(`Failed to set disposition attributes for ${payload.task.taskSid} to ${newConvAttributes}`, error);
    }
  });
};
