/**
 * Customer Display - Task Complete Action Hook
 * Listens to task completion events and clears task from Redux state
 */

import { Actions } from '@twilio/flex-ui';
import { setCurrentTask } from '../state';
import * as Flex from '@twilio/flex-ui';

export const actionHook = function registerTaskCompleteListener(flex: typeof Flex, manager: Flex.Manager) {
  Actions.addListener('afterCompleteTask', (payload) => {
    try {
      const task = payload.task;
      console.log('[customer-display] Task completed:', {
        taskSid: task.taskSid,
        channel: task.channelType,
      });

      // Clear the current task from Redux state
      manager.store.dispatch(setCurrentTask(null));
    } catch (error) {
      console.error('[customer-display] Error in TaskComplete action:', error);
    }
  });
};
