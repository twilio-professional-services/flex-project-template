import { Notifications } from '@twilio/flex-ui';

import { isExternalDirectoryEnabled, isVoiceXWTEnabled, getExternalDirectory } from '../../config';
import { FlexEvent } from '../../../../types/feature-loader';
import { registerStartExternalColdTransfer } from '../custom-actions/startExternalColdTransfer';
import { CustomTransferDirectoryNotification } from '../notifications/CustomTransferDirectory';

export const eventName = FlexEvent.pluginsInitialized;
export const eventHook = () => {
  registerStartExternalColdTransfer();
  if (isExternalDirectoryEnabled() && !isVoiceXWTEnabled()) {
    Notifications.showNotification(CustomTransferDirectoryNotification.XWTFeatureDependencyMissing);
  }

  if (getExternalDirectory().length > 0) {
    console.warn(
      'custom-transfer-directory: external_directory.directory is deprecated. It is recommended to use the contacts feature to populate the external directory instead.',
    );
  }
};
