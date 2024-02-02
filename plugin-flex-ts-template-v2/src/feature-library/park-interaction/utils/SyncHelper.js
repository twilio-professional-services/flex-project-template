import { Notifications } from '@twilio/flex-ui';

import SyncClient from '../../../utils/sdk-clients/sync/SyncClient';
import { UnparkInteractionNotification } from '../flex-hooks/notifications';

export default class SyncHelper {
  static async pageHandler(paginator, items = []) {
    paginator.items.forEach((item) => {
      items.push({
        item,
      });
    });
    if (paginator.hasNextPage) {
      const next = await paginator.nextPage();
      return SyncHelper.pageHandler(next, items);
    }
    return items;
  }

  static async getMapItems(mapName) {
    try {
      const map = await SyncClient.map(mapName);
      const paginator = await map.getItems();
      return SyncHelper.pageHandler(paginator);
    } catch (error) {
      console.error('Map getItems() failed', error);
      Notifications.showNotification(UnparkInteractionNotification.UnparkListError, { message: error });
      return [];
    }
  }
}
