import { Manager, Notifications } from '@twilio/flex-ui';
import { Workspace } from 'twilio-taskrouter';

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

  // const jwt = Manager.getInstance().store.getState().flex.session.ssoTokenPayload.token;
  // const workspace = new Workspace(jwt, {}, 'WS4c32d4fa21408e88a93a0e64d05b755a');
  // console.log({ workspace });
  // const worker = workspace.fetchWorkers({
  //   TargetWorkersExpression: 'location == "Allen"',
  // });
  // console.log({ worker });

  const workspace = Manager.getInstance().workspaceClient;
  console.log({ workspace });
  const worker = workspace?.fetchWorkers({
    TargetWorkersExpression: '1==1',
    maxWorkers: 5000,
  });
  console.log({ worker });
};
