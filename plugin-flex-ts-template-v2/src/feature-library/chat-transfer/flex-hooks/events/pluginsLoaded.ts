import { FlexEvent } from "../../../../types/manager/FlexEvent";
import { isFeatureEnabled } from "../../index";
import { registerCustomChatTransferAction } from "../../custom-action/chatTransferTask";

const pluginsLoadedHandler = (flexEvent: FlexEvent) => {
  if (!isFeatureEnabled()) return;

  console.log(`Feature enabled: chat-transfer`);
  registerCustomChatTransferAction();
};

export default pluginsLoadedHandler;
