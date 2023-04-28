import { resetHangUpBy } from '../../helpers/hangUpBy';
import { FlexEvent } from '../../../../types/feature-loader';

export const eventName = FlexEvent.pluginsInitialized;
export const eventHook = () => {
  resetHangUpBy();
};
