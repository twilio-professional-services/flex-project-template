import { resetHangUpBy } from '../../helpers/hangUpBy';
import { FlexEvent } from '../../../../types/feature-loader';
import { registerSetHangUpByAction } from '../custom-action/setHangUpBy';

export const eventName = FlexEvent.pluginsInitialized;
export const eventHook = () => {
  resetHangUpBy();
  registerSetHangUpByAction();
};
