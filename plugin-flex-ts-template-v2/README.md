# Plugin Flex TS Template V2

This is the _Twilio Professional Services_ Flex Plugin that accompanies the Flex Project Template.

This plugin defines a package structure to make distributed development easier when augmenting Flex with custom features and behaviors.

---

1. [Overview](#overview)
2. [Feature initialization](#feature-initialization)
3. [Feature library](#feature-library)
   1. [flex-hooks](#flex-hooks)
      1. [actions](#actions)
      1. [channels](#channels)
      1. [chat-orchestrator](#chat-orchestrator)
      1. [components](#components)
      1. [css-overrides](#css-overrides)
      1. [events](#events)
      1. [jsclient-event-listeners](#jsclient-event-listeners)
      1. [notification-events](#notification-events)
      1. [notifications](#notifications)
      1. [paste-elements](#paste-elements)
      1. [reducers](#reducers)
      1. [strings](#strings)
      1. [teams-filters](#teams-filters)
   2. [Adding a feature](#adding-a-feature)
   3. [Usage for a project or single-purpose plugin](#usage-for-a-project-or-single-purpose-plugin)
4. [Types](#types)
5. [Utils](#utils)
   1. [live-query](#live-query)
   2. [serverless](#serverless)
      1. [API Service](#api-service)
      2. [PhoneNumbers](#phonenumbers)
      3. [ProgrammableChat](#programmable-chat)
      4. [TaskRouter](#task-router)

---

# Overview

The following guide assumes the reader has some familiarity with _Twilio Flex Plugins_, the _Flex Action Framework_ and _Flex React Component Model_. If not, you can pop over [here](https://www.twilio.com/docs/flex/developer/ui-and-plugins) and read up on it.

Even though the Flex plugin model allows a lot of extensibility and customization, it doesn't offer any opinions on how to structure the code so that it is readable and maintainable. The package structure outlined here aims to do that.

# Feature initialization

The plugin works by cycling through each of the `feature-library` directories (described below) at initialization, and calling each feature's `register` function, which in turn cycles through each of the modules in the `flex-hooks` directory of the feature.

The plugin logs each hook for each feature as it is loaded. This is particularly useful when layering up multiple features and extensions as we need to see where our custom behaviors might overlap with other custom behaviors.

![](/scripts/screenshots/feature-loader.png)

# Feature library

The feature library is intended to be a suite of typical features added to flex that can accelerate the launch of a Flex project by showing developers "how-to". Features can easily be turned on or off via the [flex-config](/README.md#flex-config) - or they can easily be removed completely by removing the feature directory or using the [remove-features](/README.md#removing-features) script.

Each feature in the feature library is self contained. Let's look at [Caller ID](/plugin-flex-ts-template-v2/src/feature-library/caller-id) as an example.

For this feature, we have a `custom-components` directory, containing components that are created for rendering within Flex (in this case, the Caller ID dropdown). Within the `flex-hooks` directory, we can see which hooks are used to hook in the behavioural changes to Flex. In this case, we can see hooks defined for the `StartOutboundCall` action, the `OutboundDialerPanel` component, the `pluginLoaded` event, and our own Redux `state` namespace.

![](/scripts/screenshots/caller-id.png)

## flex-hooks

Whether hooking into the [actions framework](https://www.twilio.com/docs/flex/developer/ui/actions) or [injecting, adding or removing components from the JSX tree](https://www.twilio.com/docs/flex/developer/ui/components) or maybe one of the many of other ways Flex can be customized and extended, its extremely useful to see at a glance what extensions have been made to what hook points. To this end, the plugin dynamically loads and logs each hook in the feature's `flex-hooks` directory, so that all hook points are listed and visible in one place.

There are several types of hooks, which should be organized in a directory per type. For example, the feature's `flex-hooks` directory should be structured as follows:

```
├── flex-hooks
│   ├── actions
│   │   └── CompleteTask.ts
│   ├── channels
│   │   └── Callback.tsx
│   ├── chat-orchestrator
│   │   └── completed.ts
│   ├── components
│   │   └── MainHeader.tsx
│   ├── css-overrides
│   │   └── index.ts
│   ├── events
│   │   └── taskAccepted.ts
│   ├── jsclient-event-listeners
│   │   └── conversations-client
│   │       └── conversationJoined.ts
│   ├── notification-events
│   │   └── beforeAddNotification.ts
│   ├── notifications
│   │   └── index.ts
│   ├── paste-elements
│   │   └── index.ts
│   ├── reducers
│   │   └── slice.ts
│   ├── strings
│   │   └── index.ts
│   └── teams-filters
│       └── index.ts
```

The feature loader determines hook type by the named export(s) in each respective module. The following sections are templates that you can use as a starting point for each type of hook.

### actions

Use an actions hook to register actions in the [Flex Actions Framework](https://www.twilio.com/docs/flex/developer/ui/use-ui-actions).

```ts
import * as Flex from '@twilio/flex-ui';

import { FlexActionEvent, FlexAction } from '../../../../types/feature-loader';

export const actionEvent = FlexActionEvent.before;
export const actionName = FlexAction.CompleteTask;
export const actionHook = function exampleCompleteTaskHook(flex: typeof Flex, manager: Flex.Manager) {
  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload, abortFunction) => {
    // your code here
  });
};
```

Supported values for `actionEvent`:
```ts
enum FlexActionEvent {
  before = 'before',
  after = 'after',
  replace = 'replace',
}
```

Supported values for `actionName`:
```ts
enum FlexAction {
  AcceptTask = 'AcceptTask',
  ApplyTeamsViewFilters = 'ApplyTeamsViewFilters',
  CompleteTask = 'CompleteTask',
  HangupCall = 'HangupCall',
  HoldCall = 'HoldCall',
  UnholdCall = 'UnholdCall',
  HoldParticipant = 'HoldParticipant',
  KickParticipant = 'KickParticipant',
  MonitorCall = 'MonitorCall',
  StopMonitoringCall = 'StopMonitoringCall',
  SelectTask = 'SelectTask',
  SetWorkerActivity = 'SetWorkerActivity',
  StartOutboundCall = 'StartOutboundCall',
  ToggleMute = 'ToggleMute',
  UnholdParticipant = 'UnholdParticipant',
  NavigateToView = 'NavigateToView',
  RejectTask = 'RejectTask',
  SetActivity = 'SetActivity',
  StartExternalWarmTransfer = 'StartExternalWarmTransfer',
  ShowDirectory = 'ShowDirectory',
  TransferTask = 'TransferTask',
  WrapupTask = 'WrapupTask',
}
```

### channels

Use a channels hook to register new [task channel definitions](https://www.twilio.com/docs/flex/developer/ui/task-channel-definitions).

```ts
import * as Flex from '@twilio/flex-ui';
import PhoneCallbackIcon from '@material-ui/icons/PhoneCallback';

import { TaskAttributes } from '../../../../types/task-router/Task';

export const channelHook = function createCallbackChannel(flex: typeof Flex, manager: Flex.Manager) {
  const channelDefinition = flex.DefaultTaskChannels.createDefaultTaskChannel(
    'callback',
    (task) => {
      const { taskType } = task.attributes as TaskAttributes;
      return task.taskChannelUniqueName === 'voice' && taskType === 'callback';
    },
    'CallbackIcon',
    'CallbackIcon',
    'palegreen',
  );

  const { templates } = channelDefinition;
  const CallbackChannel: Flex.TaskChannelDefinition = {
    ...channelDefinition,
    templates: {
      ...templates,
      TaskListItem: {
        ...templates?.TaskListItem,
        firstLine: (task: Flex.ITask) => `${task.queueName}: ${task.attributes.name}`,
      },
      TaskCanvasHeader: {
        ...templates?.TaskCanvasHeader,
        title: (task: Flex.ITask) => `${task.queueName}: ${task.attributes.name}`,
      },
      IncomingTaskCanvas: {
        ...templates?.IncomingTaskCanvas,
        firstLine: (task: Flex.ITask) => task.queueName,
      },
    },
    icons: {
      active: <PhoneCallbackIcon key="active-callback-icon" />,
      list: <PhoneCallbackIcon key="list-callback-icon" />,
      main: <PhoneCallbackIcon key="main-callback-icon" />,
    },
  };

  return CallbackChannel;
};
```

### chat-orchestrator

Use a chat orchestrator hook to modify chat orchestration via `ChatOrchestrator.setOrchestrations`.

```ts
import * as Flex from '@twilio/flex-ui';

import { FlexOrchestrationEvent } from '../../../../types/feature-loader';

export const chatOrchestratorHook = (flex: typeof Flex, manager: Flex.Manager) => ({
  event: FlexOrchestrationEvent.completed,
  handler: handleChatComplete,
});

const handleChatComplete = (task: Flex.ITask): any => {
  return [Flex.ChatOrchestratorEvent.DeactivateConversation, Flex.ChatOrchestratorEvent.LeaveConversation];
};
```

Supported values for `event`:
```ts
enum FlexOrchestrationEvent {
  accepted = 'accepted',
  wrapup = 'wrapup',
  completed = 'completed',
}
```

### components

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
  CRMContainer = 'CRMContainer',
  MainHeader = 'MainHeader',
  MessageListItem = 'MessageListItem',
  MessageInputActions = 'MessageInputActions',
  NoTasksCanvas = 'NoTasksCanvas',
  ParticipantCanvas = 'ParticipantCanvas',
  QueueStats = 'QueueStats',
  SideNav = 'SideNav',
  TaskCanvasHeader = 'TaskCanvasHeader',
  TaskCanvasTabs = 'TaskCanvasTabs',
  TaskListButtons = 'TaskListButtons',
  TaskOverviewCanvas = 'TaskOverviewCanvas',
  TeamsView = 'TeamsView',
  ViewCollection = 'ViewCollection',
  WorkerCanvas = 'WorkerCanvas',
  WorkersDataTable = 'WorkersDataTable',
  WorkerDirectory = 'WorkerDirectory',
  WorkerProfile = 'WorkerProfile',
  OutboundDialerPanel = 'OutboundDialerPanel',
  TaskInfoPanel = 'TaskInfoPanel',
  SupervisorTaskCanvasHeader = 'SupervisorTaskCanvasHeader',
}
```

### css-overrides

Use a CSS override hook to set `componentThemeOverrides` for [various Flex UI components](https://assets.flex.twilio.com/docs/releases/flex-ui/2.1.0/theming/Theme/).

```ts
import * as Flex from '@twilio/flex-ui';

export const cssOverrideHook = (flex: typeof Flex, manager: Flex.Manager) => {
  return {
    MainHeader: {
      Container: {
        '.Twilio-MainHeader-end': {
          "[data-paste-element='MENU']": {
            overflowY: 'scroll',
            maxHeight: '90vh',
          },
        },
      },
    },
  };
};
```

### events

Use an event hook to add your own handler for [Flex events](https://assets.flex.twilio.com/docs/releases/flex-ui/2.1.0/ui-actions/FlexEvent/).

```ts
import * as Flex from '@twilio/flex-ui';

import { FlexEvent } from '../../../../types/feature-loader';

export const eventName = FlexEvent.taskReceived;
export const eventHook = function exampleTaskReceivedHandler(
  flex: typeof Flex,
  manager: Flex.Manager,
  task: Flex.ITask,
) {
  // your code here
};
```

Supported values for `eventName`:
```ts
enum FlexEvent {
  taskReceived = 'taskReceived',
  taskUpdated = 'taskUpdated',
  taskAccepted = 'taskAccepted',
  taskCanceled = 'taskCanceled',
  taskCompleted = 'taskCompleted',
  taskRejected = 'taskRejected',
  taskRescinded = 'taskRescinded',
  taskTimeout = 'taskTimeout',
  taskWrapup = 'taskWrapup',
  pluginsInitialized = 'pluginsInitialized',
  tokenUpdated = 'tokenUpdated',
}
```

### jsclient-event-listeners

Use a JS client event listener hook to add your own handler for events from the various client SDKs within Flex.

```ts
import * as Flex from '@twilio/flex-ui';
import { Conversation } from '@twilio/conversations';

import { FlexJsClient, ConversationEvent } from '../../../../../types/feature-loader';

export const clientName = FlexJsClient.conversationsClient;
export const eventName = ConversationEvent.conversationJoined;
export const jsClientHook = function exampleConversationJoinedHandler(
  flex: typeof Flex,
  manager: Flex.Manager,
  conversation: Conversation,
) {
  // your code here
};
```

Supported values for `clientName`:
```ts
enum FlexJsClient {
  conversationsClient = 'conversationsClient',
  voiceClient = 'voiceClient',
  workerClient = 'workerClient',
}
```

Supported values for `eventName`:
```ts
enum ConversationEvent {
  conversationJoined = 'conversationJoined',
}
enum VoiceEvent {
  incoming = 'incoming',
}
enum WorkerEvent {
  reservationCreated = 'reservationCreated',
}
```

Supported values for `eventName` depends on the value of `clientName`:

- FlexJsClient.conversationsClient:
  - ConversationEvent.conversationJoined
- FlexJsClient.voiceClient:
  - VoiceEvent.incoming
- FlexJsClient.workerClient:
  - WorkerEvent.reservationCreated

Support for additional events may be added to `src/utils/feature-loader/jsclient-event-listeners.ts`. PRs are welcome!

### notification-events

Use a notification event hook to add your own handler for various [Flex Notification Manager events](https://assets.flex.twilio.com/docs/releases/flex-ui/2.1.0/nsa/NotificationManager/#exports.NotificationEvent).

```ts
import * as Flex from '@twilio/flex-ui';

export const eventName = Flex.NotificationEvent.beforeAddNotification;
export const notificationEventHook = (flex: typeof Flex, manager: Flex.Manager, notification: any, cancel: any) => {
  // your code here
};
```

### notifications

Use a notification hook to register your own notification definitions for use in your feature.

```ts
import * as Flex from '@twilio/flex-ui';

import { StringTemplates } from '../strings';

// Export the notification IDs an enum for better maintainability when accessing them elsewhere
export enum ExampleNotification {
  MyNotification = 'MyNotification',
  MyNotification2 = 'MyNotification2',
}

// Return an array of Flex.Notification
export const notificationHook = (flex: typeof Flex, manager: Flex.Manager) => [
  {
    id: ExampleNotification.MyNotification,
    type: Flex.NotificationType.error,
    content: StringTemplates.MyString,
  },
  {
    id: ExampleNotification.MyNotification2,
    type: Flex.NotificationType.success,
    content: StringTemplates.MyString2,
  },
];
```

### paste-elements

Use a Paste elements hook to register your own element definitions for usage in your feature's UI built with [Twilio Paste](https://paste.twilio.design/).

```ts
import { PasteCustomCSS } from '@twilio-paste/customization';

export const pasteElementHook = {
  MY_CUSTOM_ELEMENT: {
    paddingLeft: 'space40',
    paddingRight: 'space40',
    paddingTop: 'space40',
  },
  MY_OTHER_ELEMENT: {
    paddingBottom: 'space40',
  },
} as { [key: string]: PasteCustomCSS };
```

### reducers

Use this example Redux Toolkit slice as a starting point for keeping Redux state within your feature.

```ts
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface ExampleState {
  myValue: boolean;
  myOtherValue: boolean;
}

const initialState = {
  myValue: false,
  myOtherValue: false,
} as ExampleState;

const exampleSlice = createSlice({
  name: 'exampleStateName',
  initialState,
  reducers: {
    updateMyValue(state, action: PayloadAction<boolean>) {
      state.myValue = action.payload;
    },
    updateMyOtherValue(state, action: PayloadAction<boolean>) {
      state.myOtherValue = action.payload;
    },
  },
});

export const { updateMyValue, updateMyOtherValue } = exampleSlice.actions;
export const reducerHook = () => ({ exampleStateName: exampleSlice.reducer });
```

### strings

Use a string hook to register your own string definitions for use in your feature.

```ts
// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  MyString = 'MyString',
  MyString2 = 'MyString2',
}

export const stringHook = () => ({
  [StringTemplates.MyString]: 'Your string here',
  [StringTemplates.MyString2]: 'Your second string here',
});
```

### teams-filters

Use a teams filter hook to register your own [filter definitions](https://www.twilio.com/docs/flex/developer/ui/team-view-filters) in the Teams view.

```ts
import { FilterDefinition } from '@twilio/flex-ui';

import { emailFilter } from '../../filters/emailFilter'; // example filter from the teams-view-filters feature

export const teamsFilterHook = async function getSampleFilters() {
  const enabledFilters = [] as Array<FilterDefinition>;

  enabledFilters.push(emailFilter());

  return enabledFilters;
};
```

## Adding a feature

To add a new feature, use the [add-feature](/README.md#add-feature) script, which will create a new folder under the [feature-library](/plugin-flex-ts-template-v2/src/feature-library/) directory, add the boilerplate required for the feature to load, and set up configuration. Consult with other features in the feature library for further examples. When tested and completed, raise a pull request for submission back into the main branch of the template.

## Usage for a project or single-purpose plugin

When modifying behavior of the template (such as in a fork or clone) for use in a project or a single-purpose plugin, it is less practical to compartmentalize everything into features. It is expected in this case to use a single feature directory within `feature-library`, creating a single large feature.

# Types

The types folder contains various object definitions that are used throughout the template. Many declare the interface for operations within the serverless functions. Some key types to pay attention to:

- [Task](/plugin-flex-ts-template-v2/src/types/task-router/Task.ts) defines expected object model for customisations to task. It is useful here to annotate what custom conversation measures are used for.
- [Worker](/plugin-flex-ts-template-v2/src/types/task-router/Worker.ts) defines expected object model for customisations to worker.

# Utils

## live-query

It's not uncommon to want to leverage the [built-in indexes](https://www.twilio.com/docs/sync/live-query#index-name) for custom features in Flex. The live query helper is a convenience class for doing just that, allowing you to hook into one of the four indexes with a query, and instantly be able to manage the results.

## serverless

The serverless directory contains the interface to the set of common Twilio operations - these can be thought of as wrappers around the direct suite of Twilio APIs, making it easy to leverage these operations without having to rebuild an interface. They come with an example of how retry handling can be built in.

### API Service

The common class that implements retry handling; all utilities that act as interfaces to serverless functions should extend this.

### PhoneNumbers

- getAccountPhoneNumbers()

### Programmable Chat

- updateChannelAttributes(channelSid: string, attributes: object)

### TaskRouter

- updateTaskAttributes(taskSid: string, attributesUpdate: object, deferUpdates: bool = false)
  - this will merge the attributesUpdate object with existing attributes. It will use the backend to ensure the operation is transactionally safe be checking the ETAG header. This is something not currently done when using the front end SDK. If deferUpdates=true, the attributes will not be saved until either another update with deferUpdates=false occurs, or CompleteTask is invoked.
- getQueues(force: boolean)
- getWorkerChannels(workerSid: string)
- updateWorkerChannel(workerSid: string, workerChannelSid: string, capacity: number, available: boolean)