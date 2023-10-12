import { Actions } from '@twilio/flex-ui';

import { unparkInteraction } from '../../actions/ParkInteraction';
import { UnparkInteractionPayload } from '../../types/ParkInteractionPayload';

export const registerUnparkInteractionAction = () => {
  Actions.registerAction('UnparkInteraction', async (payload: UnparkInteractionPayload) => unparkInteraction(payload));
};
