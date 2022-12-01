import * as Flex from "@twilio/flex-ui";
import DeviceManager from "../../custom-components/DeviceManager/DeviceManager";
import { getFeatureFlags } from '../../../../utils/configuration/configuration';

const { enabled = false } = getFeatureFlags().features?.device_manager || {};

export function addDeviceManagerToMainHeader(flex: typeof Flex) {
  if (!enabled) return;

  flex.MainHeader.Content.add(<DeviceManager key="device-manager" />, {
    sortOrder: 0,
    align: "end",
  });
}
