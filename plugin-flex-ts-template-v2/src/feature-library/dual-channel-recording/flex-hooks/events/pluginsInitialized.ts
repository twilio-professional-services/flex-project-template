import * as Flex from '@twilio/flex-ui';

import { NotificationIds } from '../notifications/DualChannelRecording';
import { getChannelToRecord } from '../../config';
import { FlexEvent } from '../../../../types/feature-loader';

export const eventName = FlexEvent.pluginsInitialized;
export const eventHook = () => {
  // Test to make sure the channel config property has been
  // configured correctly. If it has not, throw errors and notifications.
  if (getChannelToRecord() !== 'worker' && getChannelToRecord() !== 'customer') {
    Flex.Notifications.showNotification(NotificationIds.DualChannelBroken);
    console.error(
      'ERROR: dual_channel_recording.channel does not have the correct value. Refer to your ui_attributes to fix.',
    );
  }
};
