import * as Flex from '@twilio/flex-ui';

import DeviceManager from '../../custom-components/DeviceManager/DeviceManager';
import { FlexComponent } from '../../../../types/feature-loader';

export const componentName = FlexComponent.MainHeader;
export const componentHook = function addDeviceManagerToMainHeader(flex: typeof Flex) {
  flex.MainHeader.Content.add(<DeviceManager key="device-manager" />, {
    sortOrder: 0,
    align: 'end',
  });
};
