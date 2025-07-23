Use a component hook to [modify or add components](https://www.twilio.com/docs/flex/developer/ui/work-with-components-and-props) to Flex UI.

```ts
import * as Flex from '@twilio/flex-ui';

import MyComponentName from '../../custom-components/MyComponentName';
import { FlexComponent } from '../../../../types/feature-loader';

export const componentName = FlexComponent.CallCanvas;
export const componentHook = function addMyComponentToCallCanvas(flex: typeof Flex, manager: Flex.Manager) {
  flex.CallCanvas.Content.add(<MyComponentName key="my-awesome-component" />, {
    sortOrder: -1,
  });
};
```

Supported values for `componentName`:

```ts
enum FlexComponent {
  AgentDesktopView = 'AgentDesktopView',
  CallCanvas = 'CallCanvas',
  CallCanvasActions = 'CallCanvasActions',
  ConnectingOutboundCallCanvas = 'ConnectingOutboundCallCanvas',
  ConnectingOutboundCallCanvasActions = 'ConnectingOutboundCallCanvasActions',
  CRMContainer = 'CRMContainer',
  FlexUnifyContainer = 'FlexUnifyContainer',
  IncomingTaskCanvas = 'IncomingTaskCanvas',
  IncomingTaskCanvasActions = 'IncomingTaskCanvasActions',
  MainHeader = 'MainHeader',
  MessageBubble = 'MessageBubble',
  MessageCanvasTray = 'MessageCanvasTray',
  MessageInputActions = 'MessageInputActions',
  MessageListItem = 'MessageListItem',
  NoTasksCanvas = 'NoTasksCanvas',
  OutboundDialerPanel = 'OutboundDialerPanel',
  ParticipantCanvas = 'ParticipantCanvas',
  QueueStats = 'QueueStats',
  SideNav = 'SideNav',
  SupervisorTaskCanvasHeader = 'SupervisorTaskCanvasHeader',
  TaskCanvasHeader = 'TaskCanvasHeader',
  TaskCanvasTabs = 'TaskCanvasTabs',
  TaskCard = 'TaskCard',
  TaskInfoPanel = 'TaskInfoPanel',
  TaskListButtons = 'TaskListButtons',
  TaskListItem = 'TaskListItem',
  TaskOverviewCanvas = 'TaskOverviewCanvas',
  TeamsView = 'TeamsView',
  ViewCollection = 'ViewCollection',
  WorkerCanvas = 'WorkerCanvas',
  WorkerDirectory = 'WorkerDirectory',
  WorkerProfile = 'WorkerProfile',
  WorkersDataTable = 'WorkersDataTable',
}
```