import * as Flex from '@twilio/flex-ui';
import PauseStatusPanel from '../../custom-components/PauseStatusPanel';
import { UIAttributes } from 'types/manager/ServiceConfiguration';

const { custom_data } = Flex.Manager.getInstance().configuration as UIAttributes;
const { enabled = false, indicator_permanent = false } = custom_data?.features?.pause_recording || {}

export function addPauseStatusPanel(flex: typeof Flex, manager: Flex.Manager) {
  
  if (!enabled || !indicator_permanent) return;

  flex.CallCanvas.Content.add(<PauseStatusPanel key="pause-status-panel" />, {
    sortOrder: -1
  });
}
