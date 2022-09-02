import * as Flex from "@twilio/flex-ui";
import { FlexEvent } from "../../../types/manager/FlexEvent";

import taskAcceptedHandlerActivityReservationHandler from "../../../feature-library/activity-reservation-handler/flex-hooks/events/taskAccepted";

export default (flex: typeof Flex, manager: Flex.Manager) => {
  manager.events.addListener(FlexEvent.taskAccepted, (task: Flex.ITask) =>{
    taskAcceptedHandlerActivityReservationHandler(task, FlexEvent.taskAccepted)
  });
};
