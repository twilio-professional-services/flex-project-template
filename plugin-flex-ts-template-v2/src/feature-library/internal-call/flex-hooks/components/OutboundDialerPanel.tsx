import * as Flex from '@twilio/flex-ui';
import InternalDialpad from '../../custom-components/InternalDialpad';
import { isFeatureEnabled } from '../..';

export function addInternalCallToDialerPanel(flex: typeof Flex, manager: Flex.Manager) {

  if(!isFeatureEnabled()) return;
  
  flex.OutboundDialerPanel.Content.add(<InternalDialpad key="select-dialpad" manager={manager} />);
}
