import * as Flex from "@twilio/flex-ui";
import { SSOTokenPayload } from "@twilio/flex-ui/src/core/TokenStorage";
import { FlexEvent } from "../../types/manager/FlexEvent";

// @ts-ignore
import featurePluginsLoaded from "../../feature-library/*/flex-hooks/events/pluginsLoaded.*";
// @ts-ignore
import featureTokenUpdated from "../../feature-library/*/flex-hooks/events/tokenUpdated.*";
// @ts-ignore
import featureTaskAccepted from "../../feature-library/*/flex-hooks/events/taskAccepted.*";
// @ts-ignore
import featureTaskCanceled from "../../feature-library/*/flex-hooks/events/taskCanceled.*";
// @ts-ignore
import featureTaskCompleted from "../../feature-library/*/flex-hooks/events/taskCompleted.*";
// @ts-ignore
import featureTaskReceived from "../../feature-library/*/flex-hooks/events/taskReceived.*";
// @ts-ignore
import featureTaskRejected from "../../feature-library/*/flex-hooks/events/taskRejected.*";
// @ts-ignore
import featureTaskRescinded from "../../feature-library/*/flex-hooks/events/taskRescinded.*";
// @ts-ignore
import featureTaskTimeout from "../../feature-library/*/flex-hooks/events/taskTimeout.*";
// @ts-ignore
import featureTaskUpdated from "../../feature-library/*/flex-hooks/events/taskUpdated.*";
// @ts-ignore
import featureTaskWrapup from "../../feature-library/*/flex-hooks/events/taskWrapup.*";

const taskEventImports = {
  [FlexEvent.taskAccepted]: typeof featureTaskAccepted !== 'undefined' ? featureTaskAccepted : [],
  [FlexEvent.taskCanceled]: typeof featureTaskCanceled !== 'undefined' ? featureTaskCanceled : [],
  [FlexEvent.taskCompleted]: typeof featureTaskCompleted !== 'undefined' ? featureTaskCompleted : [],
  [FlexEvent.taskReceived]: typeof featureTaskReceived !== 'undefined' ? featureTaskReceived : [],
  [FlexEvent.taskRejected]: typeof featureTaskRejected !== 'undefined' ? featureTaskRejected : [],
  [FlexEvent.taskRescinded]: typeof featureTaskRescinded !== 'undefined' ? featureTaskRescinded : [],
  [FlexEvent.taskTimeout]: typeof featureTaskTimeout !== 'undefined' ? featureTaskTimeout : [],
  [FlexEvent.taskUpdated]: typeof featureTaskUpdated !== 'undefined' ? featureTaskUpdated : [],
  [FlexEvent.taskWrapup]: typeof featureTaskWrapup !== 'undefined' ? featureTaskWrapup : [],
}

export default (flex: typeof Flex, manager: Flex.Manager) => {
  
  if (typeof featurePluginsLoaded !== 'undefined') {
    featurePluginsLoaded.forEach((file: any) => {
      manager.events.addListener(FlexEvent.pluginsLoaded, () => {
        file.default(FlexEvent.pluginsLoaded)
      });
    });
  }
  
  if (typeof featureTokenUpdated !== 'undefined') {
    featureTokenUpdated.forEach((file: any) => {
      // pass in token parameter from event to handler
      manager.events.addListener(FlexEvent.tokenUpdated, (tokenPayload: SSOTokenPayload) => {
        file.default(tokenPayload, FlexEvent.tokenUpdated)
      });
    });
  }
  
  for (const [event, eventHandlers] of Object.entries(taskEventImports)) {
    eventHandlers.forEach((file: any) => {
      // pass in task parameter from event to handler
      manager.events.addListener(event, (task: Flex.ITask) => {
        file.default(task, event as FlexEvent)
      });
    });
  }
};
