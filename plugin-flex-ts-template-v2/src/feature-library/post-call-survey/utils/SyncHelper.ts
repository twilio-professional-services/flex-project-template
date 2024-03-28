import { Notifications } from '@twilio/flex-ui';

import SyncClient from '../../../utils/sdk-clients/sync/SyncClient';
import { PostCallSurveyUiNotification } from '../flex-hooks/notifications';

export default class SyncHelper {
  static pageHandler(paginator: any) {
    const items: any[] = [];
    paginator.items.forEach((item: any) => {
      items.push(item);
    });
    return paginator.hasNextPage ? paginator.nextPage().then(this.pageHandler) : items;
  }

  static async getMapItems(mapName: string) {
    try {
      const map = await SyncClient.map(mapName);
      const paginator = await map.getItems();
      return this.pageHandler(paginator);
    } catch (error) {
      console.error('Map getItems() failed', error);
      Notifications.showNotification(PostCallSurveyUiNotification.SYNC_ERROR, { message: error });
      return [];
    }
  }
}
