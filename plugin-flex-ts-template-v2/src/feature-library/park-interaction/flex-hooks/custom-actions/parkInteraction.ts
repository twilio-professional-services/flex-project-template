import { Actions } from '@twilio/flex-ui';

import { parkInteraction } from '../../actions/ParkInteraction';
import ParkInteractionPayload from '../../types/ParkInteractionPayload';

export const registerParkInteractionAction = () => {
  Actions.registerAction('ParkInteraction', async (payload: ParkInteractionPayload) => parkInteraction(payload));
};
