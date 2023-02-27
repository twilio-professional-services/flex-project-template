import * as Flex from "@twilio/flex-ui";
import taskEndedHandler from "../../helpers/taskEndedHandler";
import { FlexEvent } from "../../../../types/feature-loader";

export const eventName = FlexEvent.taskCompleted;
export const eventHook = (flex: typeof Flex, manager: Flex.Manager, task: Flex.ITask) => {
  taskEndedHandler(task, eventName);
};
