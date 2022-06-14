import * as Flex from '@twilio/flex-ui';
import OutboundCallerIDSelector from '../../custom-components/OutboundCallerIDSelector'

export function addOutboundCallerIdSelectorToMainHeader(flex: typeof Flex) {
  flex.OutboundDialerPanel.Content.add(<OutboundCallerIDSelector key="outbound-callerid-selector" />, {
    sortOrder: 1,
  });
}
