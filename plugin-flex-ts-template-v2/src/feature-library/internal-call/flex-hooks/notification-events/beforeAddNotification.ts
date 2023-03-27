import * as Flex from '@twilio/flex-ui';

export const eventName = Flex.NotificationEvent.beforeAddNotification;
export const notificationEventHook = (flex: typeof Flex, manager: Flex.Manager, notification: any, cancel: any) => {
  // When on an internal call, Flex is not aware of the conference state, and will throw an error saying such.
  // Here we suppress the error only when on an internal call, to improve user experience.

  if (notification.id === 'FailedToFetchParticipants') {
    let onInternalCall = false;
    manager.store.getState().flex.worker.tasks.forEach((task) => {
      if (task.attributes && (task.attributes as any).client_call === true) {
        onInternalCall = true;
      }
    });

    if (onInternalCall) {
      console.log('Suppressing conference error notification for internal call');
      cancel();
    }
  }
};
