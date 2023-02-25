import { resetHangUpBy } from '../../helpers/hangUpBy';
import { FlexEvent } from "../../../../types/feature-loader/FlexEvent";

export const eventName = FlexEvent.pluginsLoaded;
export const eventHook = () => {
  resetHangUpBy();
};
