# Plugin Flex TS Template V2

This is the _Twilio Professional Services_ Flex Plugin that accompanies the Flex Project Template.

This plugin defines a package structure to make distributed development easier when augmenting Flex with custom features and behaviors.

---

1. [Overview](#overview)
2. [Flex hooks](#flex-hooks)
   1. [actions](#actions)
   2. [components](#components)
   3. [init](#init)
3. [Feature Library](#feature-library)
   1. [Adding a feature](#adding-a-feature)
   2. [Extending template on a project](#extending-template-on-a-project)
4. [Types](#types)
5. [Utils](#utils)
   1. [Live Query Helper](#live-query)
6. [Serverless](#serverless)
   1. [API Service](#api-service)
   2. [PhoneNumbers](#phonenumbers)
   3. [ProgrammableChat](#programmable-chat)
   4. [TaskRouter](#task-router)

# Overview

The following guide assumes the reader has some familiarity with _Twilio Flex Plugins_, the _Flex Action Framework_ and _Flex React Component Model_ if not you can pop over [here](https://www.twilio.com/docs/flex/developer/ui-and-plugins) and read up on it.

Even though the Flex plugin model allows a lot of extensibility and customization it doesnt offer any opinions on how to structure the code so that its readable and maintainable. The package structure outlined here aims to do that.

---

## flex-hooks

Whether hooking into the [actions framework](https://www.twilio.com/docs/flex/developer/ui/actions) or [injecting, adding or removing components from the JSX tree](https://www.twilio.com/docs/flex/developer/ui/components) or maybe one of the many of other ways Flex can be customized and extended, its extremely useful to see at a glance what extensions have been made to what hook points. To this end, the package structure is laid out so that all hook points are listed and visible in one place.

We can see under `src/flex-hooks/` a list of the ways in which Flex can be extended.

![](/scripts/screenshots/flex-hooks.png)

### actions

If we take the [actions](/plugin-flex-ts-template-v2/src/flex-hooks/actions/actions.ts) framework as an example, we can see at a glace different behavioural extensions that have been applied. In this case from different features in the [feature-library](#feature-library), both triggering behaviour **before** `StartOutboundCall` action is executed

```ts
//...
import { applySelectedCallerIdForDialedNumbers } from "../../feature-library/caller-id/flex-hooks/actions/StartOutboundCall";
import { changeWorkerActivityBeforeOutboundCall } from "../../feature-library/activity-reservation-handler/flex-hooks/actions/StartOutboundCall";
//...

const actionsToRegister: Actions = {
  //...
  StartOutboundCall: {
    before: [
      applySelectedCallerIdForDialedNumbers,
      changeWorkerActivityBeforeOutboundCall,
    ],
    after: [],
    replace: [],
  },
  //...
};
```

### components

Or if we take a look at the [components](/plugin-flex-ts-template-v2/src/flex-hooks//components/components.ts) we can see at a glance the Flex components that have been in some way modified. Here we can see the `OutboundDailerPanel` has been in some way modifide by the two features from the feature library, `caller-id` and `internal-call`

```ts
import { addOutboundCallerIdSelectorToMainHeader } from "../../feature-library/caller-id/flex-hooks/components/OutboundDialerPanel";
import { addInternalCallToDialerPanel } from "../../feature-library/internal-call/flex-hooks/components/OutboundDialerPanel";

//...

const componentHandlers: Components = {
  //..
  OutboundDialerPanel: [
    addOutboundCallerIdSelectorToMainHeader,
    addInternalCallToDialerPanel,
  ],
  //...
};
```

and this pattern continues for the rest of the flex hooks. The plugin works by cycling through each of the flex-hooks folders at initialization, and calling the associated extensions.

### init

```ts
import * as Flex from "@twilio/flex-ui";
import { FlexPlugin } from "@twilio/flex-plugin";

import AddReducers from "./flex-hooks/redux";
import ConfigureFlexStrings from "./flex-hooks/strings";
import CustomizeFlexComponents from "./flex-hooks/components";
import CustomizeFlexActions from "./flex-hooks/actions";
import RegisterCustomChannels from "./flex-hooks/channels";
import RegisterFlexNotifications from "./flex-hooks/notifications";
import RegisterJSClientEventListeners from "./flex-hooks/jsclient-event-listeners";

import CreateSdkClientInstances from "./flex-hooks/sdk-clients";
import TeamFilters from "./flex-hooks/teams-filters";
import CustomChatOrchestration from "./flex-hooks/chat-orchestrator";
import CssOverrides from "./flex-hooks/css-overrides";
import CustomizePasteElements from "./flex-hooks/paste-elements";
import Events from "./flex-hooks/events";

const PLUGIN_NAME = "FlexTSTemplatePlugin";

export default class FlexTSTemplatePlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof Flex }
   * @param manager { Flex.Manager }
   */
  init(flex: typeof Flex, manager: Flex.Manager) {
    const initializers = [
      AddReducers,
      ConfigureFlexStrings,
      RegisterCustomChannels,
      RegisterFlexNotifications,
      RegisterJSClientEventListeners,
      CustomizePasteElements,
      CustomizeFlexActions,
      CustomizeFlexComponents,
      CreateSdkClientInstances,
      TeamFilters,
      CustomChatOrchestration,
      CssOverrides,
      Events,
    ];

    initializers.forEach((initializer) => initializer(flex, manager));
  }
}
```

This is particularly useful when layering up multiple features and extensions as we need to see where our custom behaviours might overlap with other custom behaviors.

---

## feature-library

The feature library is intended to be a suite of typical features added to flex that can accelerate the launch of a Flex project by showing developers "how-to". Features can easily be turned on or off via the [flex-config](/README.md#flex-config) - or they can easily be removed completely using the [remove-features](/README.md#removing-features) script.

each feature in the feature library is self contained, lets look at [Caller ID](/plugin-flex-ts-template-v2/src/feature-library/caller-id) as an example

For this feature, we have `custom-components` that are created for rendering within flex, we can then see from within its own `flex-hooks` sub-folder, what hooks are used to hook in the behavioural changes to Flex. In this case it is the `StartOutboundCall` action, the `OutboundDialerPanel` component, the `pluginLoaded` event and we add our own `state` to redux.

![](/scripts/screenshots/caller-id.png)

As we just discussed in the [overview](#overview) These are imported into the associated `flex-hooks` and are called at initilization.

For clarity, lets take a look at our `StartOutboundCall` [action](/plugin-flex-ts-template-v2/src/feature-library/caller-id/flex-hooks/actions/StartOutboundCall.ts) of our `Caller id`

```js
import * as Flex from "@twilio/flex-ui";
import { AppState, reduxNamespace } from "../../../../flex-hooks/states";
import { getFeatureFlags } from '../../../../utils/configuration';

const { enabled = false } = getFeatureFlags()?.features?.caller_id || {};

export function applySelectedCallerIdForDialedNumbers(
  flex: typeof Flex,
  manager: Flex.Manager
) {
  if (!enabled) return;

  flex.Actions.addListener(
    "beforeStartOutboundCall",
    async (payload, abortFunction) => {
      const state = manager.store.getState() as AppState;
      const selectedCallerId =
        state[reduxNamespace].outboundCallerIdSelector.selectedCallerId;

      if (!payload.callerId && selectedCallerId)
        payload.callerId = selectedCallerId;
    }
  );
}
```

As we can see this exports a function `applySelectedCallerIdForDialedNumbers` and as we saw in the [actions overview](#actions) we import this function to declare it in the main `flex-hooks/actions` to provide visibility of our extension.

We can also see that the hook also references teh flex configuration data to see if this feature is enabled, otherwise when this function is run it won't do anything.

### Adding a feature

To add a new feature, create a new folder under the [feature-library](/plugin-flex-ts-template-v2/src/feature-library/) directory and lay out your `custom-components`, `flex-hooks` and any supporting `types` and `utilz` following the same pattern outlined above. Consult with other features in the feature library for further examples. When tested and completed, raise a pull request for submission back into the main branch of the template.

### extending template on a project

When modifiying behavior of the template on a project (a fork or possible clone of the template) it is less practical to compartmentalize everything into features. It is expected in this case to use the `project-extensions` folder to contain `custom-components` and `flex-hooks` much like a single large feature in the feature library.

## types

The types folder contains various object definitions that are used throughout the template, many declare the interface for operations within the serverless functions. Some key types to pay attention to.

- [Task](/plugin-flex-ts-template-v2/src/types/task-router/Task.ts) defines expected object model for customisations to task. It is useful here to annotate what custom conversation measures are used for.
- [Worker](/plugin-flex-ts-template-v2/src/types/task-router/Worker.ts) defines expected object model for customisations to worker.
- [CustomServiceConfiguration](/plugin-flex-ts-template-v2/src/types/manager/CustomServiceConfiguration.ts) This is where custom feature configuration models are declared.

## Utils

# live-query

Its not uncommon to want to levearge the [built in indexes](https://www.twilio.com/docs/sync/live-query#index-name) for custom features in flex. The live query helper is a convenience class for doing just that. Allowing you to hook into one of the four indexes with a query and instantly be able to manage the results.

# serverless

The serverless package contains the interface to the set of common twilio operations - these can be thought of as wrrappers around the direct suite of Twilio APIs, making it easy to leverrage these operations without having to rebuild an interface. They come with an example of how retry handling can be built in.

## API Service

The common class that implements retry handling, all utilities that act as interfaces to serverless functions should extend this

## PhoneNumbers

- getAccountPhoneNumbers()

## Programmable Chat

- updateChannelAttributes(channelSid: string, attributes: object)

## Task Router

- updateTaskAttributes(taskSid: string, attributesUpdate: object)
  - this will merge the attributesUpdate object with existing attributes. It will use the backend to ensure the operation is transactionally safe be checking the ETAG header. This is something not currently done when using the front end SDK.
- getQueues(force: boolean)
- getWorkerChannels(workerSid: string)
- updateWorkerChannel(workerSid: string, workerChannelSid: string, capacity: number, available: boolean)
