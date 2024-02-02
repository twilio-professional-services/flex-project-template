import { Manager, Notifications } from '@twilio/flex-ui';
import { Workspace } from 'twilio-taskrouter';

import { subscribe, SyncStreamEvent } from '../../utils/sync-stream';
import { SupervisorBroadcastNotification } from '../notifications';

export const registerSyncStreamListener = () => {
  const handleMessage = (event: SyncStreamEvent) => {
    const myWorkerSid = Manager.getInstance().store.getState().flex.worker?.worker?.sid;
    const {
      message: {
        data: {
          type,
          payload: { message },
        },
      },
    } = event;
    if (type === 'broadcast' && myWorkerSid === event?.message.data.targetWorkers) {
      handleBroadCastMessage(message);
    }
  };

  const handleBroadCastMessage = (message: string) => {
    Notifications.showNotification(SupervisorBroadcastNotification.BROADCAST, { message });
  };

  subscribe(handleMessage);

  const workspace = Manager.getInstance().workspaceClient;
  console.log({ workspace });
  const worker = workspace?.fetchWorkers({
    TargetWorkersExpression: '1==1',
    maxWorkers: 5000,
  });
  console.log({ worker });
};
