import * as Flex from '@twilio/flex-ui';

import { parkInteraction } from '../../actions/ParkInteraction';
import { FlexEvent } from '../../../../types/feature-loader';
import ParkInteractionPayload from '../../types/ParkInteractionPayload';

export const eventName = FlexEvent.pluginsInitialized;
export const eventHook = function registerParkInteractionAction(flex: typeof Flex) {
  flex.Actions.registerAction('ParkInteraction', async (payload: ParkInteractionPayload) => parkInteraction(payload));
};
