import * as Flex from '@twilio/flex-ui';
import InternalDialpad from '../../custom-components/InternalDialpad';
import { getFeatureFlags } from '../../../../utils/configuration/configuration';

const { enabled = false } = getFeatureFlags().features?.internal_call || {};

export function addInternalCallToDialerPanel(flex: typeof Flex, manager: Flex.Manager) {

  if(!enabled) return;
  
  flex.OutboundDialerPanel.Content.add(<InternalDialpad key="select-dialpad" manager={manager} />);
}
