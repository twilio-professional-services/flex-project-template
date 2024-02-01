---
sidebar_label: Overview
sidebar_position: 0
title: Flex hooks overview
---

The plugin works by cycling through each of the `feature-library` directories at initialization, and calling each feature's `register` function, which in turn cycles through each of the modules in the `flex-hooks` directory of the feature.

Whether hooking into the [actions framework](https://www.twilio.com/docs/flex/developer/ui/actions) or [injecting, adding or removing components from the JSX tree](https://www.twilio.com/docs/flex/developer/ui/components) or maybe one of the many of other ways Flex can be customized and extended, its extremely useful to see at a glance what extensions have been made to what hook points. The plugin logs each hook for each feature as it is loaded. This is particularly useful when layering up multiple features and extensions as we need to see where our custom behaviors might overlap with other custom behaviors.

![scripts](/img/guides/feature-loader.png)

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

The feature loader determines hook type by the named export(s) in each respective module. The pages in this documentation section serve as templates that you can use as a starting point for each type of hook.