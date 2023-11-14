import { isFeatureEnabled } from '../../config';
import { FlexEvent } from '../../../../types/feature-loader';
import ContactsUtil from '../../utils/ContactsUtil';

export const eventName = FlexEvent.pluginsInitialized;
export const eventHook = () => {
  if (isFeatureEnabled()) {
    ContactsUtil.initContactHistory();
  }
};
