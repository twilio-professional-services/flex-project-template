import * as Flex from "@twilio/flex-ui";
import { SSOTokenPayload } from "@twilio/flex-ui/src/core/TokenStorage";
import { FlexEvent } from "../../types/manager/FlexEvent";
import events from "./events";

const taskEvents = [
  FlexEvent.taskAccepted,
  FlexEvent.taskCanceled,
  FlexEvent.taskCompleted,
  FlexEvent.taskReceived,
  FlexEvent.taskRejected,
  FlexEvent.taskRescinded,
  FlexEvent.taskTimeout,
  FlexEvent.taskUpdated,
  FlexEvent.taskWrapup,
];

const isTaskEvent = (event: FlexEvent): boolean => {
  return taskEvents.includes(event);
};

export default (flex: typeof Flex, manager: Flex.Manager) => {
  for (const [event, eventHandlers] of Object.entries(events)) {
    if (isTaskEvent(event as FlexEvent)) {
      // pass in task parameter from event to handler
      manager.events.addListener(event, (task: Flex.ITask) => {
        eventHandlers.forEach((eventHandler) =>
          eventHandler(task, event as FlexEvent)
        );
      });
    } else if (event === FlexEvent.tokenUpdated) {
      // pass in token parameter from event to handler
      manager.events.addListener(event, (tokenPayload: SSOTokenPayload) => {
        eventHandlers.forEach((eventHandler) =>
          eventHandler(tokenPayload, event as FlexEvent)
        );
      });
    } else {
      manager.events.addListener(event, () => {
        eventHandlers.forEach((eventHandler) =>
          eventHandler(event as FlexEvent)
        );
      });
    }
  }
};
