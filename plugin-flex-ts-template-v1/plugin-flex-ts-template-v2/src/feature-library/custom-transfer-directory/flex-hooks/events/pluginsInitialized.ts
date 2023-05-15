import { Notifications } from '@twilio/flex-ui';

import { isExternalDirectoryEnabled, isFeatureEnabled, isVoiceXWTEnabled } from '../../config';
import { FlexEvent } from '../../../../types/feature-loader';
import { registerStartExternalColdTransfer } from '../custom-actions/startExternalColdTransfer';
import { CustomTransferDirectoryNotification } from '../notifications/CustomTransferDirectory';

export const eventName = FlexEvent.pluginsInitialized;
export const eventHook = () => {
  if (isFeatureEnabled()) {
    registerStartExternalColdTransfer();
    if (isExternalDirectoryEnabled() && !isVoiceXWTEnabled())
      Notifications.showNotification(CustomTransferDirectoryNotification.XWTFeatureDependencyMissing);
  }
};
