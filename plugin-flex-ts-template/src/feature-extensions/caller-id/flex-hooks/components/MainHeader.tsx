import * as Flex from '@twilio/flex-ui';
import OutboundCallerIDSelector from '../../custom-components/OutboundCallerIDSelector'

export default function addOutboundCallerIdSelector(flex: typeof Flex) {
  flex.MainHeader.Content.add(<OutboundCallerIDSelector key="outbound-callerid-selector" />, {
    sortOrder: 1,
  });
}
