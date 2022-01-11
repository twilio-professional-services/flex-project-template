import * as Flex from '@twilio/flex-ui';
import { SyncClient, SyncMap, SyncMapItem } from 'twilio-sync';
import { Paginator } from 'twilio-sync/lib/paginator';

const client = new SyncClient(Flex.Manager.getInstance().user.token);

export default client;

export const getAllSyncMapItems = (syncMap: SyncMap) => {
  return syncMap.getItems().then(_pageHandler);
}

async function _pageHandler(paginator: Paginator<SyncMapItem>): Promise<SyncMapItem[]> {
  if (paginator.hasNextPage) {
    return paginator.items.concat(await paginator.nextPage().then(_pageHandler));
  }
  return Promise.resolve(paginator.items);
}