import * as Flex from '@twilio/flex-ui';
import ConferenceDialog from '../../custom-components/ConferenceDialog';
import ConferenceMonitor from '../../custom-components/ConferenceMonitor';

import { UIAttributes } from 'types/manager/ServiceConfiguration';

const { custom_data } = Flex.Manager.getInstance().configuration as UIAttributes;
const { enabled = false } = custom_data?.features?.conference || {};

export function addConferenceToCallCanvas(flex: typeof Flex) {

  if(!enabled) return;
  
  flex.CallCanvas.Content.add(<ConferenceDialog
    key="conference-modal"
  />, { sortOrder: 100 });
  
  // This component doesn't render anything to the UI, it just monitors
  // conference changes and takes action as necessary
  flex.CallCanvas.Content.add(<ConferenceMonitor
    key="conference-monitor"
  />, { sortOrder: 999 });
}
