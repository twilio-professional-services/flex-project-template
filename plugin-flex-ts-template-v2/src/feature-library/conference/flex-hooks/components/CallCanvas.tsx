import * as Flex from '@twilio/flex-ui';
import ConferenceDialog from '../../custom-components/ConferenceDialog';
import ConferenceMonitor from '../../custom-components/ConferenceMonitor';

import { getFeatureFlags } from '../../../../utils/configuration/configuration';

const { enabled = false, add_button = true } = getFeatureFlags().features?.conference || {};

export function addConferenceToCallCanvas(flex: typeof Flex) {

  if(!enabled) return;
  
  // This component doesn't render anything to the UI, it just monitors
  // conference changes and takes action as necessary
  flex.CallCanvas.Content.add(<ConferenceMonitor
    key="conference-monitor"
  />, { sortOrder: 999 });
  
  if (!add_button) return;
  // Everything below here is not relevant without the add button enabled
  
  flex.CallCanvas.Content.add(<ConferenceDialog
    key="conference-modal"
  />, { sortOrder: 100 });
}
