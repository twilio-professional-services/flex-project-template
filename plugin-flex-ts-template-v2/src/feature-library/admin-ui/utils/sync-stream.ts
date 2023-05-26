import client from '../../../utils/sdk-clients/sync/SyncClient';

export type SyncStreamEvent = {
  message: any; // twilio-sync does not export the StreamMessage type
  isLocal: boolean;
};

let stream: any; // twilio-sync does not export the SyncStream type

export const subscribe = async (publishCallback: (event: SyncStreamEvent) => void) => {
  try {
    stream = await client.stream('template-admin');
    stream.on('messagePublished', (event: SyncStreamEvent) => {
      if (!publishCallback) return;
      publishCallback(event);
    });
  } catch (error) {
    console.error('admin-ui: Unable to subscribe to Sync stream', error);
  }
};

export const publishMessage = async (message: any) => {
  try {
    await stream?.publishMessage(message);
  } catch (error) {
    console.error('admin-ui: Unable to publish message to Sync stream', error);
  }
};

export const unsubscribe = async () => {
  try {
    stream?.close();
  } catch (error) {
    console.error('admin-ui: Unable to unsubscribe from Sync stream', error);
  }
};
