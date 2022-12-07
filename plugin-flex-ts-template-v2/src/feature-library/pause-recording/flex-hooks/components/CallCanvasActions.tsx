import * as Flex from '@twilio/flex-ui';
import PauseRecordingButton from '../../custom-components/PauseRecordingButton';
import { isFeatureEnabled } from '../..';

export function addPauseRecordingButton(flex: typeof Flex, manager: Flex.Manager) {
  
  if (!isFeatureEnabled()) return;
  
  const isNotInternalCall = (props: any) => props.task.attributes.client_call !== true;

  flex.CallCanvasActions.Content.add(<PauseRecordingButton key="pause-recording-button" />, {
    sortOrder: 2,
    if: isNotInternalCall
  });
}
