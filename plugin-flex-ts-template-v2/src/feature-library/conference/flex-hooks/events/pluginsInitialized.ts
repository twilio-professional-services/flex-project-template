import { isConferenceEnabledWithoutNativeXWT } from '../../config';
import { FlexEvent } from '../../../../types/feature-loader';
import { registerStartExternalWarmTransfer } from '../custom-actions/startExternalWarmTransfer';

export const eventName = FlexEvent.pluginsInitialized;
export const eventHook = () => {
  if (isConferenceEnabledWithoutNativeXWT()) {
    registerStartExternalWarmTransfer();
  }
};
