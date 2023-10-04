Use a channels hook to register new [task channel definitions](https://www.twilio.com/docs/flex/developer/ui/task-channel-definitions).

```ts
import * as Flex from "@twilio/flex-ui";
import PhoneCallbackIcon from "@material-ui/icons/PhoneCallback";

import { TaskAttributes } from "../../../../types/task-router/Task";

export const channelHook = function createCallbackChannel(
  flex: typeof Flex,
  manager: Flex.Manager
) {
  const channelDefinition = flex.DefaultTaskChannels.createDefaultTaskChannel(
    "callback",
    (task) => {
      const { taskType } = task.attributes as TaskAttributes;
      return task.taskChannelUniqueName === "voice" && taskType === "callback";
    },
    "CallbackIcon",
    "CallbackIcon",
    "palegreen"
  );

  const { templates } = channelDefinition;
  const CallbackChannel: Flex.TaskChannelDefinition = {
    ...channelDefinition,
    templates: {
      ...templates,
      TaskListItem: {
        ...templates?.TaskListItem,
        firstLine: (task: Flex.ITask) =>
          `${task.queueName}: ${task.attributes.name}`,
      },
      TaskCanvasHeader: {
        ...templates?.TaskCanvasHeader,
        title: (task: Flex.ITask) =>
          `${task.queueName}: ${task.attributes.name}`,
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

Alternatively, you can use a channels hook to modify an existing task channel definition.

```ts
import * as Flex from '@twilio/flex-ui';

import CustomerAvatarObject from '../../custom-components/CustomerAvatarObject';

export const channelHook = function overrideCallChannelToUseCustomerAttribute(
  flex: typeof Flex,
  _manager: Flex.Manager,
) {
  const channelDefinition = flex.DefaultTaskChannels.Call;
  const { templates, icons } = channelDefinition;

  channelDefinition.templates = {
    ...templates,
    TaskListItem: {
      ...flex.DefaultTaskChannels.Call.templates?.TaskListItem,
      firstLine: (task: Flex.ITask) => `(${task.attributes.customer}) ${task.defaultFrom}`,
    },
    TaskCanvasHeader: {
      ...flex.DefaultTaskChannels.Call.templates?.TaskCanvasHeader,
      title: (task: Flex.ITask) => `(${task.attributes.customer}) ${task.defaultFrom}`,
    },
  };

  channelDefinition.icons = {
    ...icons,
    list: <CustomerAvatarObject key="task-list-customer-avatar" />,
    main: <CustomerAvatarObject key="main-customer-avatar" />,
    active: <CustomerAvatarObject key="active-customer-avatar" />,
  };

  // Nothing to return from hook, since we are overriding the default Call channel versus adding a new channel
};
```