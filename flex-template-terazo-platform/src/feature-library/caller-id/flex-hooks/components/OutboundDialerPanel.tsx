import * as Flex from '@twilio/flex-ui';

import { FlexComponent } from '../../../../types/feature-loader/FlexComponent';
import OutboundCallerIDSelector from '../../custom-components/OutboundCallerIDSelector';

export const componentName = FlexComponent.OutboundDialerPanel;
export const componentHook = function addOutboundCallerIdSelectorToMainHeader(flex: typeof Flex) {
  flex.OutboundDialerPanel.Content.add(<OutboundCallerIDSelector key="outbound-callerid-selector" />, {
    sortOrder: 1,
  });
};
