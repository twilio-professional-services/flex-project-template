import { resetHangUpBy } from '../../helpers/hangUpBy';
import { FlexEvent } from '../../../../types/feature-loader';

export const eventName = FlexEvent.pluginsLoaded;
export const eventHook = () => {
  resetHangUpBy();
};
