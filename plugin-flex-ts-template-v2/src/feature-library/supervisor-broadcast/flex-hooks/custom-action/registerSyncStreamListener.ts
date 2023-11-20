import { Notifications } from '@twilio/flex-ui';

import { subscribe, SyncStreamEvent } from '../../utils/sync-stream';
import { SupervisorBroadcastNotification } from '../notifications';

export const registerSyncStreamListener = () => {
  const handleMessage = (event: SyncStreamEvent) => {
    const {
      message: {
        data: {
          type,
          payload: { message },
        },
      },
    } = event;
    if (type === 'broadcast') {
      handleBroadCastMessage(message);
    }
  };

  const handleBroadCastMessage = (message: string) => {
    Notifications.showNotification(SupervisorBroadcastNotification.BROADCAST, { message });
  };

  subscribe(handleMessage);
};
