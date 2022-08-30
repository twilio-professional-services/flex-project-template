import { FlexEvent } from "../../../../types/manager/FlexEvent";
import { initialize } from "../../index";

const pluginsLoadedHandler = (flexEvent: FlexEvent) => {
  console.log(`activity-handler: handle ${flexEvent}`);
  initialize();
};

export default pluginsLoadedHandler;
