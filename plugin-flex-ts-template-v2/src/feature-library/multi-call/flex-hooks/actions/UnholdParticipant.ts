import * as Flex from "@twilio/flex-ui";
import { handleUnhold } from '../../helpers/MultiCallHelper';
import { getFeatureFlags } from '../../../../utils/configuration/configuration';

const { enabled = false } = getFeatureFlags().features?.multi_call || {};

export function handleMultiCallUnholdParticipant(flex: typeof Flex, manager: Flex.Manager) {
  if (!enabled) return;
  
  flex.Actions.addListener('beforeUnholdParticipant', async (payload, abortFunction) => {
    handleUnhold(payload);
  });
}
