import * as Flex from '@twilio/flex-ui';
import InternalDialpad from '../../custom-components/InternalDialpad';

import { UIAttributes } from 'types/manager/ServiceConfiguration';

const { custom_data } = Flex.Manager.getInstance().configuration as UIAttributes;
const { enabled } = custom_data?.features?.internal_call || {};

export function addInternalCallToDialerPanel(flex: typeof Flex, manager: Flex.Manager) {

  if(!enabled) return;
  
  flex.OutboundDialerPanel.Content.add(<InternalDialpad key="select-dialpad" manager={manager} />);
}
