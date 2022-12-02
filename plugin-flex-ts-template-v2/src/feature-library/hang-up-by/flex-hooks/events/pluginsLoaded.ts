import { FlexEvent } from "../../../../types/manager/FlexEvent";
import { isFeatureEnabled } from "../..";
import { resetHangUpBy } from '../../helpers/hangUpBy';

const pluginsLoadedHandler = (flexEvent: FlexEvent) => {
  if (!isFeatureEnabled()) return;

  console.log(`Feature enabled: hang-up-by`);
  
  resetHangUpBy();
};

export default pluginsLoadedHandler;
