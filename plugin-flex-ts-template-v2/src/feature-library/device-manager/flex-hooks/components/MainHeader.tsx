import * as Flex from "@twilio/flex-ui";
import DeviceManager from "../../custom-components/DeviceManager/DeviceManager";

import { UIAttributes } from "types/manager/ServiceConfiguration";

const { custom_data } = Flex.Manager.getInstance().serviceConfiguration
  .ui_attributes as UIAttributes;
const { enabled = false } = custom_data?.features?.device_manager || {};

export function addDeviceManagerToMainHeader(flex: typeof Flex) {
  if (!enabled) return;

  flex.MainHeader.Content.add(<DeviceManager key="device-manager" />, {
    sortOrder: 0,
    align: "end",
  });
}
