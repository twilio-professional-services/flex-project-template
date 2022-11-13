import { SyncClient, SyncMap } from 'twilio-sync';
import Sync, { getAllSyncMapItems } from './SyncClient';

describe('sdk-clients/SyncClient', () => {
  it('should create a SyncClient instance', () => {
    expect(Sync instanceof SyncClient).toBe(true);
  });

  describe('getAllSyncMapItems', () => {
    it('should load and return all of paginated data', async () => {
      const data = [
        { key: 'testSid1', value: {} },
        { key: 'testSid2', value: {} }
      ];
      const syncMap = {
        getItems: async () => ({
          hasNextPage: true,
          items: [data[0]],
          nextPage: async () => ({ hasNextPage: false, items: [data[1]] })
        })
      } as SyncMap;
      expect(await getAllSyncMapItems(syncMap)).toEqual(data);
    });
  });
});