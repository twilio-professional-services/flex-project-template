import * as Flex from '@twilio/flex-ui';

import { FlexComponent } from '../../../../types/feature-loader/FlexComponent';
import OutboundContactSelector from '../../custom-components/OutboundContactSelector';

export const componentName = FlexComponent.OutboundDialerPanel;
export const componentHook = function addOutboundContactSelectorToDialerPanel(flex: typeof Flex) {
  flex.OutboundDialerPanel.Content.add(<OutboundContactSelector key="outbound-contact-selector" />);
};
