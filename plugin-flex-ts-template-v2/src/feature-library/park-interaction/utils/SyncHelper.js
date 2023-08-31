import { Manager, Notifications } from '@twilio/flex-ui';
import { SyncClient } from 'twilio-sync';

import { UnparkInteractionNotification } from '../flex-hooks/notifications';

const SYNC_CLIENT = new SyncClient(Manager.getInstance().user.token);

export default class SyncHelper {
  static pageHandler(paginator) {
    const items = [];
    paginator.items.forEach((item) => {
      items.push({
        item,
      });
    });
    return paginator.hasNextPage ? paginator.nextPage().then(pageHandler) : items;
  }

  static async getMapItems(mapName) {
    try {
      const map = await SYNC_CLIENT.map(mapName);
      const paginator = await map.getItems();
      return this.pageHandler(paginator);
    } catch (error) {
      console.error('Map getItems() failed', error);
      Notifications.showNotification(UnparkInteractionNotification.UnparkListError, { message: error });
      return [];
    }
  }
}
