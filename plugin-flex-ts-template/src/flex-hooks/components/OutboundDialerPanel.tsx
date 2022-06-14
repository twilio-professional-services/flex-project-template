import * as Flex from '@twilio/flex-ui';
import { addOutboundCallerIdSelectorToMainHeader } from '../../feature-library/caller-id/flex-hooks/components/OutboundDialerPanel'

export default (flex: typeof Flex, manager: Flex.Manager) => {
  addOutboundCallerIdSelectorToMainHeader(flex)
}
