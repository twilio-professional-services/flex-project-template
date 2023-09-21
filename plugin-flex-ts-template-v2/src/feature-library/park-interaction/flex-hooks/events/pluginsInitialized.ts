import * as Flex from '@twilio/flex-ui';

import { parkInteraction, unparkInteraction } from '../../actions/ParkInteraction';
import { FlexEvent } from '../../../../types/feature-loader';
import ParkInteractionPayload, { UnparkInteractionPayload } from '../../types/ParkInteractionPayload';

export const eventName = FlexEvent.pluginsInitialized;
export const eventHook = function registerParkInteractionAction(flex: typeof Flex) {
  flex.Actions.registerAction('ParkInteraction', async (payload: ParkInteractionPayload) => parkInteraction(payload));
  flex.Actions.registerAction('UnparkInteraction', async (payload: UnparkInteractionPayload) =>
    unparkInteraction(payload),
  );
};
