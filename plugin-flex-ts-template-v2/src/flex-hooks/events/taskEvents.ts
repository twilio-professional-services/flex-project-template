import * as Flex from "@twilio/flex-ui";
import taskReceivedActivityReservationHandler from "../../feature-library/activity-reservation-handler/flex-hooks/events/taskReceived";
import taskAcceptedHandlerActivityReservationHandler from "../../feature-library/activity-reservation-handler/flex-hooks/events/taskAccepted";
import taskEndedHandlerActivityReservationHandler from "../../feature-library/activity-reservation-handler/flex-hooks/events/taskEnded";
import taskWrapupHandlerActivityReservationHandler from "../../feature-library/activity-reservation-handler/flex-hooks/events/taskWrapup";
import { FlexEvent } from "../../types/manager/FlexEvent";
export default (flex: typeof Flex, manager: Flex.Manager) => {
  taskUpdatedHandlers(manager);
  taskAcceptedHandlers(manager);
  taskReceivedHandlers(manager);
  taskCanceledHandlers(manager);
  taskCompletedHandlers(manager);
  taskRejectedHandlers(manager);
  taskRescindedHandlers(manager);
  taskTimeoutHandlers(manager);
  taskWrapupHandlers(manager);
};

const taskUpdatedHandlers = (manager: Flex.Manager) => {};

const taskAcceptedHandlers = (manager: Flex.Manager) => {
  manager.events.addListener(FlexEvent.taskAccepted, (task: Flex.ITask) =>
    taskAcceptedHandlerActivityReservationHandler(task, FlexEvent.taskAccepted)
  );
};

const taskReceivedHandlers = (manager: Flex.Manager) => {
  manager.events.addListener(FlexEvent.taskReceived, (task: Flex.ITask) =>
    taskReceivedActivityReservationHandler(task, FlexEvent.taskReceived)
  );
};

const taskCanceledHandlers = (manager: Flex.Manager) => {
  manager.events.addListener(FlexEvent.taskCanceled, (task: Flex.ITask) =>
    taskEndedHandlerActivityReservationHandler(task, FlexEvent.taskCanceled)
  );
};

const taskCompletedHandlers = (manager: Flex.Manager) => {
  manager.events.addListener(FlexEvent.taskCompleted, (task: Flex.ITask) =>
    taskEndedHandlerActivityReservationHandler(task, FlexEvent.taskCompleted)
  );
};

const taskRejectedHandlers = (manager: Flex.Manager) => {
  manager.events.addListener(FlexEvent.taskRejected, (task: Flex.ITask) =>
    taskEndedHandlerActivityReservationHandler(task, FlexEvent.taskRejected)
  );
};

const taskRescindedHandlers = (manager: Flex.Manager) => {
  manager.events.addListener(FlexEvent.taskRescinded, (task: Flex.ITask) =>
    taskEndedHandlerActivityReservationHandler(task, FlexEvent.taskRescinded)
  );
};

const taskTimeoutHandlers = (manager: Flex.Manager) => {
  manager.events.addListener(FlexEvent.taskTimeout, (task: Flex.ITask) =>
    taskEndedHandlerActivityReservationHandler(task, FlexEvent.taskTimeout)
  );
};

const taskWrapupHandlers = (manager: Flex.Manager) => {
  manager.events.addListener(FlexEvent.taskWrapup, (task: Flex.ITask) =>
    taskWrapupHandlerActivityReservationHandler(task, FlexEvent.taskWrapup)
  );
};
