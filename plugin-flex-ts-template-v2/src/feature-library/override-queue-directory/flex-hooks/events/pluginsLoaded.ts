import { FlexEvent } from "../../../../types/manager/FlexEvent";
import { isOverrideQueueTransferEnabled } from "../../index";


const pluginsLoadedHandler = (flexEvent: FlexEvent) => {
  console.log('Before Feature enabled: override-queue')
  if (!isOverrideQueueTransferEnabled()) return;

  console.log(`Feature enabled: override-queue`);
};

export default pluginsLoadedHandler;