import { Notifications } from '@twilio/flex-ui';

import SyncClient from '../../../utils/sdk-clients/sync/SyncClient';
import { UnparkInteractionNotification } from '../flex-hooks/notifications';

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
      const map = await SyncClient.map(mapName);
      const paginator = await map.getItems();
      return this.pageHandler(paginator);
    } catch (error) {
      console.error('Map getItems() failed', error);
      Notifications.showNotification(UnparkInteractionNotification.UnparkListError, { message: error });
      return [];
    }
  }
}
