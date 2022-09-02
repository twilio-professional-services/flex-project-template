import * as Flex from "@twilio/flex-ui";
import { FlexEvent } from "../../../types/manager/FlexEvent";

export default (flex: typeof Flex, manager: Flex.Manager) => {
  manager.events.addListener(FlexEvent.taskUpdated, (task: Flex.ITask) =>{

  });
};
