import * as Flex from '@twilio/flex-ui';

import { UIAttributes } from 'types/manager/ServiceConfiguration';
const { custom_data } =
  (Flex.Manager.getInstance().configuration as UIAttributes) || {};
const { enabled = false } = custom_data?.features?.internal_call || {};

export default (flex: typeof Flex, manager: Flex.Manager) => {
  if (!enabled) return;
  
  suppressConferenceErrorNotification(flex, manager);
}

function suppressConferenceErrorNotification(flex: typeof Flex, manager: Flex.Manager) {
  flex.Notifications.addListener("beforeAddNotification", (notification, cancel) => {
    // When on an internal call, Flex is not aware of the conference state, and will throw an error saying such.
    // Here we suppress the error only when on an internal call, to improve user experience.
    
    if (notification.id === 'FailedToFetchParticipants') {
      let onInternalCall = false;
      manager.store.getState().flex.worker.tasks.forEach(task => {
        if (task.attributes && (task.attributes as any).client_call === true) {
          onInternalCall = true;
        }
      });
      
      if (onInternalCall) {
        console.log('Suppressing conference error notification for internal call');
        cancel();
      }
    }
  })
}