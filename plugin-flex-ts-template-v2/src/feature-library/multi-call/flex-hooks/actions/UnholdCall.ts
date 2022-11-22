import * as Flex from "@twilio/flex-ui";
import { handleUnhold } from '../../helpers/MultiCallHelper';
import { isFeatureEnabled } from '../..';

export function handleMultiCallUnholdCall(flex: typeof Flex, manager: Flex.Manager) {
  if (!isFeatureEnabled()) return;
  
  flex.Actions.addListener('beforeUnholdCall', async (payload, abortFunction) => {
    handleUnhold(payload);
  });
}
