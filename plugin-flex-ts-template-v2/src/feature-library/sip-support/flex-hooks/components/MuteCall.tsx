import * as Flex from '@twilio/flex-ui';

import CustomMuteButton from '../../custom-components/CustomMuteButton';
import { FlexComponent } from '../../../../types/feature-loader';
import { isWorkerUsingWebRTC } from '../../helpers/CallControlHelper';

export const componentName = FlexComponent.CallCanvasActions;
export const componentHook = function addMuteButton(flex: typeof Flex, _manager: Flex.Manager) {
  const shouldModifyMuteButton = () => {
    return !isWorkerUsingWebRTC();
  };

  flex.CallCanvasActions.Content.remove('toggleMute', { if: shouldModifyMuteButton });

  flex.CallCanvasActions.Content.add(<CustomMuteButton key="custom-mute-button" renderAsLink={false} />, {
    sortOrder: -1,
    if: shouldModifyMuteButton,
  });
};
