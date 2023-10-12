import { FlexEvent } from '../../../../types/feature-loader';
import { registerParkInteractionAction } from '../custom-actions/parkInteraction';
import { registerUnparkInteractionAction } from '../custom-actions/unparkInteraction';

export const eventName = FlexEvent.pluginsInitialized;
export const eventHook = function registerParkInteractionActions() {
  registerParkInteractionAction();
  registerUnparkInteractionAction();
};
