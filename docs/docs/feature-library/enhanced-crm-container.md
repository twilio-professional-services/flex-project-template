---
sidebar_label: enhanced-crm-container
title: enhanced-crm-container
---

This feature replaces the OOTB [CRMContainer](https://assets.flex.twilio.com/docs/releases/flex-ui/latest/programmable-components/components/CRMContainer) with an extensible tabbed interface with which other features can register tabs to display. This feature also optionally registers a tab of its own for displaying an IFrame.

This feature provides the following functionality:
- Extensible tabbed interface
  - Other features can register tabs via the `beforeLoadCRMContainerTabs` action
  - Tabs can receive task context, including if there is no task
- Configurable IFrame allowing you to specify a URL to display, including task and worker attribute interpolation
  - Can optionally display an alternate URL when there are no tasks
- A notable shortcoming with the OOTB CRM container is that it re-renders as you toggle between tasks. This CRMContainer will only render once and the component is simply hidden as you toggle between tasks. Furthermore, using a task attribute of parentTask we can ensure related tasks only render the one component. A typical example of this is when creating a callback which starts as one task and creates a separate outbound call task to dial the customer. When toggling between these tasks, the component will render the same instance.
  - This effectively allows agents to safely input text into the IFramed webpage without that text getting lost when switching between tasks.

## flex-user-experience

![alt text](/img/features/enhanced-crm-container/flex-user-experience-enhanced-crm-container.gif)

## setup and dependencies

Within your `ui_attributes` file, you must set two settings for this feature:

- `enabled` - set this to true to enable the feature
- `enable_url_tab` - set this to true to enable the iframe tab within the container
- `url_tab_title` - set the tab title that will be displayed for the configured URL
- `url` - set this to the URL to embed within the CRM container

There are additional settings you may also wish to configure:

- `should_display_url_when_no_tasks` - set this to true if a URL should be loaded when no task is selected
- `display_url_when_no_tasks` - set this to the URL to embed when no task is selected and the above setting is `true`

:::tip URL Special Powers
Within the `url` or the `display_url_when_no_tasks`, you may include task and/or worker attributes via template variable substitution. To do so, use the format `{{task.attribute_name_goes_here}}` or `{{worker.attribute_name_goes_here}}` within the URL. If the attribute exists, the template variable is replaced with the contents of the attribute. Otherwise, the variable is replaced with an empty string.

You may also reference the serverless base URL using the format `{{serverless.url}}`.
:::

Once your updated flex-config is deployed, the feature is enabled and ready to use.

## how does it work?

The component keeps a array of each task and renders a component for each one. Based on the currently selected task, the component re-renders and modifies the CSS to either hide or show based on whether it is the currently selected task. Once the task is removed the component is removed.

To register a tab in the enhanced CRM component, other features can register an `actions` flex-hook to inject their component and a tab title. Here is an example:

```tsx
import * as Flex from '@twilio/flex-ui';

import MyCRMTab from '../../custom-components/MyCRMTab';
import { FlexActionEvent } from '../../../../types/feature-loader';

export const actionEvent = FlexActionEvent.before;
export const actionName = 'LoadCRMContainerTabs';
export const actionHook = function addToEnhancedCRM(flex: typeof Flex, manager: Flex.Manager) {
  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload) => {
    // Remove this condition if you'd like to render even without a task selected
    // You may also conditionally return based on task attributes, etc.
    if (!payload.task) {
      return;
    }

    // Append with our component definition
    payload.components = [
      ...payload.components,
      {
        title: 'My Custom CRM Tab',
        order: 0, // optionally define preferred tab order, defaults to 999 if not present
        component: <MyCRMTab task={payload.task} key="my-crm-tab" />,
      },
    ];
  });
};
```

When the enhanced CRM component mounts, it adds a listener for `afterLoadCRMContainerTabs`, then invokes the `LoadCRMContainerTabs` action with the task in its payload. The `afterLoadCRMContainerTabs` action receives the components array in the payload, and renders those components. It immediately unregisters the listener to prevent receiving payloads for other tasks.