import * as Flex from "@twilio/flex-ui";
import { FlexEvent } from "../../../../types/manager/FlexEvent";
import { NotificationIds } from "../notifications/DualChannelRecording";
import { getFeatureFlags } from '../../../../utils/configuration/configuration';

const { enabled = false, channel } = getFeatureFlags().features?.dual_channel_recording || {};

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
