import * as Flex from "@twilio/flex-ui";
import { FlexEvent } from "../../../types/manager/FlexEvent";

import taskReceivedActivityReservationHandler from "../../../feature-library/activity-reservation-handler/flex-hooks/events/taskReceived";

export default (flex: typeof Flex, manager: Flex.Manager) => {
  manager.events.addListener(FlexEvent.taskAccepted, (task: Flex.ITask) =>{
    taskReceivedActivityReservationHandler(task, FlexEvent.taskReceived)
  });
};



