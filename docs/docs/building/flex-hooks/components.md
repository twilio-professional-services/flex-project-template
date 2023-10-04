Use a component hook to [modify or add components](https://www.twilio.com/docs/flex/developer/ui/work-with-components-and-props) to Flex UI.

```ts
import * as Flex from "@twilio/flex-ui";

import MyComponentName from "../../custom-components/MyComponentName";
import { FlexComponent } from "../../../../types/feature-loader";

export const componentName = FlexComponent.CallCanvas;
export const componentHook = function addMyComponentToCallCanvas(
  flex: typeof Flex,
  manager: Flex.Manager
) {
  flex.CallCanvas.Content.add(<MyComponentName key="my-awesome-component" />, {
    sortOrder: -1,
  });
};
```

Supported values for `componentName`:

```ts
enum FlexComponent {
  AgentDesktopView = "AgentDesktopView",
  CallCanvas = "CallCanvas",
  CallCanvasActions = "CallCanvasActions",
  CRMContainer = "CRMContainer",
  MainHeader = "MainHeader",
  MessageListItem = "MessageListItem",
  MessageInputActions = "MessageInputActions",
  NoTasksCanvas = "NoTasksCanvas",
  ParticipantCanvas = "ParticipantCanvas",
  QueueStats = "QueueStats",
  SideNav = "SideNav",
  TaskCanvasHeader = "TaskCanvasHeader",
  TaskCanvasTabs = "TaskCanvasTabs",
  TaskListButtons = "TaskListButtons",
  TaskOverviewCanvas = "TaskOverviewCanvas",
  TeamsView = "TeamsView",
  ViewCollection = "ViewCollection",
  WorkerCanvas = "WorkerCanvas",
  WorkersDataTable = "WorkersDataTable",
  WorkerDirectory = "WorkerDirectory",
  WorkerProfile = "WorkerProfile",
  OutboundDialerPanel = "OutboundDialerPanel",
  TaskInfoPanel = "TaskInfoPanel",
  SupervisorTaskCanvasHeader = "SupervisorTaskCanvasHeader",
}
```