import { FlexEvent } from "../../../../types/manager/FlexEvent";
import { isFeatureEnabled } from "../../index";

const pluginsLoadedHandler = (flexEvent: FlexEvent) => {
  if (!isFeatureEnabled()) return;

  console.log(`Feature enabled: chat-transfer`);
};

export default pluginsLoadedHandler;
