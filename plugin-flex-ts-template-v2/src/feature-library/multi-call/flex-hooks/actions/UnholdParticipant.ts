import * as Flex from "@twilio/flex-ui";
import { handleUnhold } from '../../helpers/MultiCallHelper';
import { isFeatureEnabled } from '../..';

export function handleMultiCallUnholdParticipant(flex: typeof Flex, manager: Flex.Manager) {
  if (!isFeatureEnabled()) return;
  
  flex.Actions.addListener('beforeUnholdParticipant', async (payload, abortFunction) => {
    handleUnhold(payload);
  });
}
