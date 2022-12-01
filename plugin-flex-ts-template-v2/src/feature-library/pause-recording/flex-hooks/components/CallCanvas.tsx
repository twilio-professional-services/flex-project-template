import * as Flex from '@twilio/flex-ui';
import PauseStatusPanel from '../../custom-components/PauseStatusPanel';
import { getFeatureFlags } from '../../../../utils/configuration/configuration';

const { enabled = false, indicator_permanent = false } = getFeatureFlags().features?.pause_recording || {};

export function addPauseStatusPanel(flex: typeof Flex, manager: Flex.Manager) {
  
  if (!enabled || !indicator_permanent) return;

  flex.CallCanvas.Content.add(<PauseStatusPanel key="pause-status-panel" />, {
    sortOrder: -1
  });
}
