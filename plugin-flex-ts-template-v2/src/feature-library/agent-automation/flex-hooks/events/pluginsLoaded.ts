import { FlexEvent } from "../../../../types/manager/FlexEvent";
import { isFeatureEnabled } from '../..';

const pluginsLoadedHandler = (flexEvent: FlexEvent) => {
  if (!isFeatureEnabled()) return;

  console.log(`Feature enabled: agent-automation`);
};

export default pluginsLoadedHandler;
