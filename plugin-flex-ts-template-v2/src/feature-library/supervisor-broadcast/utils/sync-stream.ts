import client from '../../../utils/sdk-clients/sync/SyncClient';

export type SyncStreamEvent = {
  message: SyncStreamMessage;
  isLocal: boolean;
};

export type SyncStreamMessage = {
  sid: string;
  data: SupervisorBroadcastMessagePayload;
};

export type SupervisorBroadcastMessagePayload = {
  type: 'broadcast' | 'command';
  targetWorkers: null;
  payload: {
    message: 'string';
  };
};

let stream: any; // twilio-sync does not export the SyncStream type

const FEATURE_NAME = 'supervisor-broadcast';

export const subscribe = async (publishCallback: (event: SyncStreamEvent) => void) => {
  try {
    stream = await client.stream(FEATURE_NAME);
    stream.on('messagePublished', (event: SyncStreamEvent) => {
      if (!publishCallback) return;
      publishCallback(event);
    });
  } catch (error) {
    console.error(`${FEATURE_NAME}: Unable to subscribe to Sync stream`, error);
  }
};

export const publishMessage = async (message: any) => {
  try {
    await stream?.publishMessage(message);
  } catch (error) {
    console.error(`${FEATURE_NAME}: Unable to publish message to Sync stream`, error);
  }
};

export const unsubscribe = async () => {
  try {
    stream?.close();
  } catch (error) {
    console.error(`${FEATURE_NAME}: Unable to unsubscribe from Sync stream`, error);
  }
};
