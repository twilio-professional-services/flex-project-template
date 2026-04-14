/**
 * Customer Display - Accept Task Action Hook
 * Listens to task acceptance events
 */

import { Actions } from '@twilio/flex-ui';

export const actionHook = function registerAcceptTaskListener() {
  Actions.addListener('afterAcceptTask', (payload) => {
    try {
      const task = payload.task;
      console.log('[customer-display] Task accepted:', {
        taskSid: task.taskSid,
        from: task.attributes?.from,
        channel: task.channelType,
      });

      // Extract phone for customer display fetch
      const phoneNumber = task.attributes?.from || task.attributes?.callerPhone || task.attributes?.phoneNumber;

      if (phoneNumber) {
        console.log('[customer-display] Phone number extracted:', phoneNumber);
      } else {
        console.warn('[customer-display] No phone number found in task attributes');
      }
    } catch (error) {
      console.error('[customer-display] Error in AcceptTask action:', error);
    }
  });
};
