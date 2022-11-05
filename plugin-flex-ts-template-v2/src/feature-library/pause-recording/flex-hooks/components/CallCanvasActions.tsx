import * as Flex from '@twilio/flex-ui';
import PauseRecordingButton from '../../custom-components/PauseRecordingButton';
import { UIAttributes } from 'types/manager/ServiceConfiguration';

const { custom_data } = Flex.Manager.getInstance().configuration as UIAttributes;
const { enabled = false } = custom_data?.features?.pause_recording || {}

export function addPauseRecordingButton(flex: typeof Flex, manager: Flex.Manager) {
  
  if (!enabled) return;

  flex.CallCanvasActions.Content.add(<PauseRecordingButton key="pause-recording-button" />, {
    sortOrder: 2
  });
}
