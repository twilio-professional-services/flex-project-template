import * as Flex from '@twilio/flex-ui';
import { addOutboundCallerIdSelectorToMainHeader } from '../../feature-library/caller-id/flex-hooks/components/OutboundDialerPanel';
import { addInternalCallToDialerPanel } from '../../feature-library/internal-call/flex-hooks/components/OutboundDialerPanel';

export default (flex: typeof Flex, manager: Flex.Manager) => {
  addOutboundCallerIdSelectorToMainHeader(flex);
  addInternalCallToDialerPanel(flex, manager);
}
