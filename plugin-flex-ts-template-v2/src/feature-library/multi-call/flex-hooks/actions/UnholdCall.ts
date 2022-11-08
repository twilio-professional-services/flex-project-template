import * as Flex from "@twilio/flex-ui";
import { UIAttributes } from "types/manager/ServiceConfiguration";
import { handleUnhold } from '../../helpers/MultiCallHelper';

const { custom_data } = Flex.Manager.getInstance().configuration as UIAttributes;
const { enabled = false } = custom_data?.features.multi_call || {};

export function handleMultiCallUnholdCall(flex: typeof Flex, manager: Flex.Manager) {
  if (!enabled) return;
  
  flex.Actions.addListener('beforeUnholdCall', async (payload: any, abortFunction: () => void) => {
    handleUnhold(payload);
  });
}
