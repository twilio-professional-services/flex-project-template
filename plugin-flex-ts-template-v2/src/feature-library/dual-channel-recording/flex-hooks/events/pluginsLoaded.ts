import * as Flex from "@twilio/flex-ui";
import { FlexEvent } from "../../../../types/manager/FlexEvent";
import { UIAttributes } from "types/manager/ServiceConfiguration";
import { NotificationIds } from "../notifications/DualChannelRecording";
const { custom_data } =
  (Flex.Manager.getInstance().serviceConfiguration
    .ui_attributes as UIAttributes) || {};
const { enabled = false, channel } =
  custom_data?.features?.dual_channel_recording || {};

const pluginsLoadedHandler = (flexEvent: FlexEvent) => {
  if (!enabled) return;

  console.log(`Feature enabled: dual-channel-recording`);
  
  // Test to make sure the channel config property has been
  // configured correctly. If it has not, throw errors and notifications.
  if (channel != 'worker' && channel != 'customer') {
    Flex.Notifications.showNotification(NotificationIds.DualChannelBroken);
    console.error(
      'ERROR: dual_channel_recording.channel does not have the correct value. Refer to your ui_attributes to fix.'
    );
  }
};

export default pluginsLoadedHandler;
