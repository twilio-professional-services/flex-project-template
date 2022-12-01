import * as Flex from "@twilio/flex-ui";
import { handleUnhold } from '../../helpers/MultiCallHelper';
import { getFeatureFlags } from '../../../../utils/configuration/configuration';

const { enabled = false } = getFeatureFlags().features?.multi_call || {};

export function handleMultiCallUnholdCall(flex: typeof Flex, manager: Flex.Manager) {
  if (!enabled) return;
  
  flex.Actions.addListener('beforeUnholdCall', async (payload, abortFunction) => {
    handleUnhold(payload);
  });
}
