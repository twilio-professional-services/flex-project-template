import { FlexEvent } from '../../../../types/feature-loader';
import { registerSyncStreamListener } from '../custom-action/registerSyncStreamListener';

export const eventName = FlexEvent.pluginsInitialized;
export const eventHook = function registerSupervisorBroadcastAction() {
  registerSyncStreamListener();
};
