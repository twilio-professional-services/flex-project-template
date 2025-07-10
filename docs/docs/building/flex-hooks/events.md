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
  chatChannelJoining = 'chatChannelJoining',
  connectionStateChanged = 'connectionStateChanged',
  flexError = 'flexError',
  flexSplitterResize = 'flexSplitterResize',
  notesSubmitted = 'notesSubmitted',
  pluginsInitialized = 'pluginsInitialized',
  selectedViewChanged = 'selectedViewChanged',
  sessionInvalidated = 'sessionInvalidated',
  sessionValidated = 'sessionValidated',
  taskAccepted = 'taskAccepted',
  taskCanceled = 'taskCanceled',
  taskCompleted = 'taskCompleted',
  taskReceived = 'taskReceived',
  taskRejected = 'taskRejected',
  taskRescinded = 'taskRescinded',
  taskTimeout = 'taskTimeout',
  taskUpdated = 'taskUpdated',
  taskWrapup = 'taskWrapup',
  tokenExpired = 'tokenExpired',
  tokenUpdated = 'tokenUpdated',
  viewResized = 'viewResized',
  workerActivityUpdated = 'workerActivityUpdated',
  workerAttributesUpdated = 'workerAttributesUpdated',
}
```