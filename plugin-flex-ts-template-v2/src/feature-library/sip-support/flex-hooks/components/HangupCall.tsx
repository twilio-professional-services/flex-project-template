import * as Flex from '@twilio/flex-ui';

import CustomHangupButton from '../../custom-components/CustomHangupButton';
import { FlexComponent } from '../../../../types/feature-loader';
import { isWorkerUsingWebRTC } from '../../helpers/CallControlHelper';

export const componentName = FlexComponent.CallCanvasActions;
export const componentHook = function addHangupButton(flex: typeof Flex, _manager: Flex.Manager) {
  const shouldModifyHangupButton = () => {
    return !isWorkerUsingWebRTC();
  };
  flex.CallCanvasActions.Content.remove('hangup', { if: shouldModifyHangupButton });

  flex.CallCanvasActions.Content.add(<CustomHangupButton key="custom-hangup-button" />, {
    if: shouldModifyHangupButton,
  });
};
