import * as Flex from '@twilio/flex-ui';

import InternalDialpad from '../../custom-components/InternalDialpad';
import { FlexComponent } from '../../../../types/feature-loader';
import { isCallAgentEnabled, isCallQueueEnabled } from '../../config';

export const componentName = FlexComponent.OutboundDialerPanel;
export const componentHook = function addInternalCallToDialerPanel(flex: typeof Flex, manager: Flex.Manager) {
  if (!isCallAgentEnabled() && !isCallQueueEnabled()) return;
  flex.OutboundDialerPanel.Content.add(<InternalDialpad key="select-dialpad" manager={manager} />);
};
