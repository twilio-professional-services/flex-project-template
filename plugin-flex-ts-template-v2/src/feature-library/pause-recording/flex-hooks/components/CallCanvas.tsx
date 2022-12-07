import * as Flex from '@twilio/flex-ui';
import PauseStatusPanel from '../../custom-components/PauseStatusPanel';
import { isPermanentIndicatorEnabled } from '../..';

export function addPauseStatusPanel(flex: typeof Flex, manager: Flex.Manager) {
  
  if (!isPermanentIndicatorEnabled()) return;

  flex.CallCanvas.Content.add(<PauseStatusPanel key="pause-status-panel" />, {
    sortOrder: -1
  });
}
