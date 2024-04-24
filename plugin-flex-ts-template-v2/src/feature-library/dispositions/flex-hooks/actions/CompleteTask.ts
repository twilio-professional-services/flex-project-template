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

    // If notes are disabled, and no dispositions are configured, return.
    if (numDispositions < 1 && !isNotesEnabled() && textAttributes.length < 1 && selectAttributes.length < 1) {
      return;
    }

    // Retrieve the user input from Redux.
    const { tasks } = (manager.store.getState() as AppState)[reduxNamespace].dispositions as DispositionsState;
    const taskDisposition = tasks[payload.task.taskSid];

    // Check for any required custom attributes that are missing.
    let missingCustomAttrs = 0;
    textAttributes.forEach((attr) => {
      if (
        attr.required &&
        (!taskDisposition?.custom_attributes || !taskDisposition?.custom_attributes[attr.conversation_attribute])
      )
        missingCustomAttrs += 1;
    });
    selectAttributes.forEach((attr) => {
      if (
        attr.required &&
        (!taskDisposition?.custom_attributes || !taskDisposition?.custom_attributes[attr.conversation_attribute])
      )
        missingCustomAttrs += 1;
    });

    // If nothing exists for this task in Redux, we only need to check the configuration to see if we should abort.
    if (!taskDisposition) {
      if (isRequireDispositionEnabledForQueue(queueSid, queueName) && numDispositions > 0) {
        handleAbort(flex, abortFunction, true);
      } else if (missingCustomAttrs > 0) {
        handleAbort(flex, abortFunction, false);
      }
      return;
    }

    // Validate the task data from Redux against the configuration to see if any required data is missing.
    if (
      isRequireDispositionEnabledForQueue(queueSid, queueName) &&
      !taskDisposition.disposition &&
      numDispositions > 0
    ) {
      handleAbort(flex, abortFunction, true);
      return;
    }

    if (missingCustomAttrs > 0) {
      handleAbort(flex, abortFunction, false);
      return;
    }

    if (
      !taskDisposition.disposition &&
      (!isNotesEnabled() || !taskDisposition.notes) &&
      !Object.keys(taskDisposition.custom_attributes).length
    ) {
      // Nothing for us to do, and it's okay!
      return;
    }

    // We have data to save! Build the task attribute update payload.
    let newConvAttributes = {};

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
