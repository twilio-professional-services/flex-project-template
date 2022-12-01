import * as Flex from '@twilio/flex-ui';
import OutboundCallerIDSelector from '../../custom-components/OutboundCallerIDSelector'
import { getFeatureFlags } from '../../../../utils/configuration/configuration';

const { enabled = false } = getFeatureFlags().features?.caller_id || {};

export function addOutboundCallerIdSelectorToMainHeader(flex: typeof Flex) {

  if(!enabled) return;
  
  flex.OutboundDialerPanel.Content.add(<OutboundCallerIDSelector key="outbound-callerid-selector" />, {
    sortOrder: 1,
  });
}
