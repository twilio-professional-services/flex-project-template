import * as Flex from "@twilio/flex-ui";
import { FlexEvent } from "../../../types/manager/FlexEvent";

import taskWrapupHandlerActivityReservationHandler from "../../../feature-library/activity-reservation-handler/flex-hooks/events/taskWrapup";


export default (flex: typeof Flex, manager: Flex.Manager) => {
  manager.events.addListener(FlexEvent.taskWrapup, (task: Flex.ITask) =>{
    taskWrapupHandlerActivityReservationHandler(task, FlexEvent.taskWrapup)
  });
};
