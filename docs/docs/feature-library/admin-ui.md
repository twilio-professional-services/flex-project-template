---
sidebar_label: admin-ui
title: admin-ui
---

## Feature summary

This feature adds a user interface to Flex for easily managing the configuration of features within the template. Every feature can be enabled or disabled, and each feature's deployed configuration is editable. Configuration changes can be made globally or to only the current user, allowing for easy testing and development. The admin panel is fully dynamic, automatically showing features added to the template. In most cases, feature developers do not need to do anything for the feature to be shown and manage-able via admin-ui. However, features with complex configuration requirements may use the provided hook pattern to register their own configuration component (see "Extending the configuration interface" below).

:::info local development

When running Flex locally, the configuration in `public/appConfig.js` overrides any global settings. Admin UI works only with the hosted Flex configuration. As such, `appConfig.js` overrides can create confusion when using this feature.

For this reason, the admin-ui feature is automatically disabled by default when the local environment is initially setup.  This is done using `appConfig.js` to avoid confusion with the feature. The panel can still be enabled locally, but it is advised when doing so to first clear out all the overrides from `appConfig.js` under `custom_data.features`.

::: 

## Flex User Experience

![Admin-ui demo](/img/features/admin-ui/admin-ui.gif)

## Setup and dependencies

This feature is enabled by default and requires no further configuration.

If you are using an infrastructure-as-code deployment strategy, exposing a configuration interface outside of the code repository is undesirable. For such deployments, it is suggested to disable this feature, and set the `OVERWRITE_CONFIG=true` environment variable as part of the flex-config deployment (this is set up as an input variable on the `Deploy Flex` github actions script). This will result in the repository flex-config as the source of truth.

## How does it work?

This feature uses the Flex Configuration API to retrieve and store global feature settings. To store per-user setting overrides, worker attributes are stored for only the overridden features, in order to prevent reaching the maximum worker attributes size. Only configuration that has already been deployed is available in the interface--that means flex-config must have been deployed first (which it should be if the setup instructions were followed).

To prevent accidentally overwriting changes made by other users at the same time, when a global change is made, a Sync stream is used to fan out a message to all clients with the admin-ui open. This message shows affected clients an alert, disables the save functionality, and offers an option to reload the config.

The configuration interface shows the appropriate controls for top-level feature settings that are boolean, string, or number values. For other property types, as well as nested objects, a JSON editor is displayed. This editor requires the input JSON to be valid before saving is allowed. However, features can instead provide their own component as the configuration interface if desired.

### Extending the configuration interface

If a feature has complex configuration options, that feature can register its own component(s) for display in the feature configuration interface. The feature receives the initial configuration, and is provided callback functions to send the updated configuration to the admin-ui, or to disable/enable the save button.

To do so, the feature should register an admin-hook by creating an `admin-hook.tsx` file in the feature directory root. This file's `adminHook` export will be invoked with the following payload interface:

```ts
interface CustomComponentPayload {
  feature: string;
  initialConfig: any;
  setModifiedConfig: (featureName: string, newConfig: any) => void;
  setAllowSave: (featureName: string, allowSave: boolean) => void;
  component?: JSX.Element;
  hideDefaultComponents?: boolean;
}
```

The feature should update the payload to provide the `component` and `hideDefaultComponents` parameters. Here is an example admin-hook showing the expected usage:

```ts
import ActivityHandlerAdmin from './custom-components/ActivityHandlerAdmin/ActivityHandlerAdmin';

export const adminHook = function addActivityReservationHandlerAdmin(payload: any) {
  if (payload.feature !== 'activity_reservation_handler') return; // Important! We only want to add a component for our feature's settings.
  payload.component = <ActivityHandlerAdmin {...payload} />; // Pass the payload as props so the component can update admin-ui
  payload.hideDefaultComponents = true; // Set this to true if you wish to hide the default components provided by admin-ui
};
```

Note that we are passing the payload as props to the component. This allows the component to call `payload.setModifiedConfig` and/or `payload.setAllowSave` when edits are being made, allowing the admin-ui to behave as desired.
