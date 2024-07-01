import * as Flex from '@twilio/flex-ui';
import { Unsubscribe } from '@reduxjs/toolkit';

import AppState from '../../../types/manager/AppState';
import { reduxNamespace } from '../../../utils/state';
import { ExtendedWrapupState } from '../flex-hooks/states/extendedWrapupSlice';
import { TaskQualificationConfig } from '../types/ServiceConfiguration';
import TaskRouterService from '../../../utils/serverless/TaskRouter/TaskRouterService';
import logger from '../../../utils/logger';

const startTimer = (
  task: Flex.ITask,
  taskConfig: TaskQualificationConfig,
  isExtended: boolean,
  unsubscribe?: Unsubscribe,
) => {
  const { sid } = task;
  const scheduledTime =
    task.dateUpdated.getTime() + taskConfig.wrapup_time + (isExtended ? taskConfig.extended_wrapup_time : 0);
  const currentTime = new Date().getTime();
  const timeout = scheduledTime - currentTime > 0 ? scheduledTime - currentTime : 0;

  return window.setTimeout(async () => {
    // Always unsubscribe from redux updates if subscribed so that we don't leak subscriptions
    if (unsubscribe) {
      unsubscribe();
    }
    if (task && Flex.TaskHelper.isInWrapupMode(task)) {
      if (taskConfig.default_outcome) {
        try {
          await TaskRouterService.updateTaskAttributes(
            task.taskSid,
            {
              conversations: {
                outcome: taskConfig.default_outcome,
              },
            },
            true,
          );
        } catch (error) {
          logger.error(`[agent-automation] Error updating task outcome: ${error}`);
        }
      }
      logger.info(`[agent-automation] Performing auto-wrapup for ${sid}`);
      Flex.Actions.invokeAction('CompleteTask', { sid });
      return;
    }
    logger.info(`[agent-automation] Didn't auto-wrapup due to task already completed for ${sid}`);
  }, timeout);
};

export const setAutoCompleteTimeout = async (
  manager: Flex.Manager,
  task: Flex.ITask,
  taskConfig: TaskQualificationConfig,
) => {
  const state = manager.store.getState() as AppState;
  const { extendedReservationSids } = state[reduxNamespace].extendedWrapup as ExtendedWrapupState;
  const { sid } = task;
  let isExtended = extendedReservationSids.includes(sid);

  if (!taskConfig) {
    return;
  }

  if (isExtended && taskConfig.extended_wrapup_time < 1) {
    return;
  }

  try {
    logger.info(`[agent-automation] Setting auto-wrapup timer for ${sid}`);
    let wrapTimer: number;

    // Subscribe to redux updates if we need to handle extended wrapup
    const unsubscribe = taskConfig.allow_extended_wrapup
      ? manager.store.subscribe(() => {
          const newState = manager.store.getState() as AppState;
          const { extendedReservationSids: newExtendedReservationSids } = newState[reduxNamespace]
            .extendedWrapup as ExtendedWrapupState;
          const newIsExtended = newExtendedReservationSids.includes(sid);

          // This callback function runs for every redux update; we only care about when this task's extended wrapup state changes
          if (isExtended === newIsExtended) {
            return;
          }
          isExtended = newIsExtended;

          if (wrapTimer) {
            logger.info(`[agent-automation] Clearing existing auto-wrapup timer for ${sid}`);
            window.clearTimeout(wrapTimer);
          }
          if (
            taskConfig &&
            taskConfig.auto_wrapup &&
            taskConfig.allow_extended_wrapup &&
            (!isExtended || taskConfig.extended_wrapup_time > 0)
          ) {
            logger.info(`[agent-automation] Creating new auto-wrapup timer for ${sid}`);
            wrapTimer = startTimer(task, taskConfig, isExtended, unsubscribe);
          }
        })
      : undefined;

    wrapTimer = startTimer(task, taskConfig, isExtended, unsubscribe);
  } catch (error: any) {
    logger.error(`Error attempting to set wrap up timeout for reservation: ${sid}`, error);
  }
};
