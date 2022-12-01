import * as Flex from '@twilio/flex-ui';
import PauseRecordingButton from '../../custom-components/PauseRecordingButton';
import { getFeatureFlags } from '../../../../utils/configuration/configuration';

const { enabled = false } = getFeatureFlags().features?.pause_recording || {};

export function addPauseRecordingButton(flex: typeof Flex, manager: Flex.Manager) {
  
  if (!enabled) return;

  flex.CallCanvasActions.Content.add(<PauseRecordingButton key="pause-recording-button" />, {
    sortOrder: 2
  });
}
