import * as Flex from '@twilio/flex-ui';

import {
  getDispositionsForQueue,
  isNotesEnabled,
  isRequireDispositionEnabledForQueue,
  getTextAttributes,
  getSelectAttributes,
} from '../../config';
import AppState from '../../../../types/manager/AppState';
import { reduxNamespace } from '../../../../utils/state';
import { DispositionsState } from '../states';
import { FlexActionEvent, FlexAction } from '../../../../types/feature-loader';
import { DispositionsNotification } from '../notifications';
import TaskRouterService from '../../../../utils/serverless/TaskRouter/TaskRouterService';

const handleAbort = (flex: typeof Flex, abortFunction: any, dispositionError: boolean) => {
  flex.Notifications.showNotification(
    dispositionError ? DispositionsNotification.DispositionRequired : DispositionsNotification.AttributeRequired,
  );

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
    const queueSid = payload.task.queueSid;
    const queueName = payload.task.queueName;
    const numDispositions = getDispositionsForQueue(queueSid, queueName).length;
    const textAttributes = getTextAttributes(queueSid, queueName);
    const selectAttributes = getSelectAttributes(queueSid, queueName);

    // If notes disabled, and no dispositions are configured, return.
    if (numDispositions < 1 && !isNotesEnabled() && textAttributes.length < 1 && selectAttributes.length < 1) {
      return;
    }

    // First, check if a disposition and/or notes are set.
    const { tasks } = (manager.store.getState() as AppState)[reduxNamespace].dispositions as DispositionsState;

    if (!tasks || !tasks[payload.task.taskSid]) {
      if (isRequireDispositionEnabledForQueue(queueSid, queueName) && numDispositions > 0) {
        handleAbort(flex, abortFunction, true);
      }
      return;
    }

    const taskDisposition = tasks[payload.task.taskSid];
    let newConvAttributes = {};

    if (
      isRequireDispositionEnabledForQueue(queueSid, queueName) &&
      !taskDisposition.disposition &&
      numDispositions > 0
    ) {
      handleAbort(flex, abortFunction, true);
      return;
    }
    let missing = 0;
    textAttributes.forEach((attr) => {
      if (attr.required && !taskDisposition?.custom_attributes[attr.conversation_attribute]) missing += 1;
    });
    selectAttributes.forEach((attr) => {
      if (attr.required && !taskDisposition?.custom_attributes[attr.conversation_attribute]) missing += 1;
    });
    if (missing > 0) handleAbort(flex, abortFunction, false);

    if (
      !taskDisposition.disposition &&
      (!isNotesEnabled() || !taskDisposition.notes) &&
      !Object.keys(taskDisposition.custom_attributes).length
    ) {
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
    newConvAttributes = {
      ...newConvAttributes,
      ...taskDisposition.custom_attributes,
    };

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
