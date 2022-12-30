import * as Flex from "@twilio/flex-ui";
import DeviceManager from "../../custom-components/DeviceManager/DeviceManager";
import { isFeatureEnabled } from '../..';

export function addDeviceManagerToMainHeader(flex: typeof Flex) {
  if (!isFeatureEnabled()) return;

  flex.MainHeader.Content.add(<DeviceManager key="device-manager" />, {
    sortOrder: 0,
    align: "end",
  });
}
