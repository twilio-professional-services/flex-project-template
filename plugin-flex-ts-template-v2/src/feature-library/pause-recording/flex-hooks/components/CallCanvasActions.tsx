import * as Flex from '@twilio/flex-ui';

import PauseRecordingButton from '../../custom-components/PauseRecordingButton';
import { FlexComponent } from '../../../../types/feature-loader';

export const componentName = FlexComponent.CallCanvasActions;
export const componentHook = function addPauseRecordingButton(flex: typeof Flex, _manager: Flex.Manager) {
  const isNotInternalCall = (props: any) => props.task.attributes.client_call !== true;

  flex.CallCanvasActions.Content.add(<PauseRecordingButton key="pause-recording-button" />, {
    sortOrder: 2,
    if: isNotInternalCall,
  });
};
