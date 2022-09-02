import * as Flex from "@twilio/flex-ui";
import { FlexEvent } from "../../../types/manager/FlexEvent";

import taskEndedHandlerActivityReservationHandler from "../../../feature-library/activity-reservation-handler/flex-hooks/events/taskEnded";

export default (flex: typeof Flex, manager: Flex.Manager) => {
  manager.events.addListener(FlexEvent.taskCompleted, (task: Flex.ITask) =>{
    taskEndedHandlerActivityReservationHandler(task, FlexEvent.taskCompleted)
  });
};
