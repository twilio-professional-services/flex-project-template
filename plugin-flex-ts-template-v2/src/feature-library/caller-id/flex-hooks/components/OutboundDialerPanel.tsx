import * as Flex from '@twilio/flex-ui';
import OutboundCallerIDSelector from '../../custom-components/OutboundCallerIDSelector';
import { isFeatureEnabled } from '../..';

export function addOutboundCallerIdSelectorToMainHeader(flex: typeof Flex) {

  if(!isFeatureEnabled()) return;
  
  flex.OutboundDialerPanel.Content.add(<OutboundCallerIDSelector key="outbound-callerid-selector" />, {
    sortOrder: 1,
  });
}
