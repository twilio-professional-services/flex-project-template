---
sidebar_label: enhanced-crm-container
sidebar_position: 16
title: enhanced-crm-container
---

This feature replaces the OOTB [CRMContainer](https://assets.flex.twilio.com/docs/releases/flex-ui/2.0.0-beta.1/programmable-components/components/CRMContainer) with the aim of providing a more user-friendly iframe.

The short coming with the OOTB container is that it re-renders as you toggle between tasks. This CRMContainer will only render once and the iframe is simply hidden as you toggle between tasks. Furthermore, using a task attribute of parentTask we can ensure related tasks only render the one iframe. A typical example of this is when creating a callback which starts as one task and creates a separate outbound call task to dial the customer. When toggling between these tasks, the iframe will render the same instance.

# flex-user-experience

![alt text](/img/f2/enhanced-crm-container/flex-user-experience-enhanced-crm-container.gif)

# setup and dependencies

Within your `ui_attributes` file, you must set two settings for this feature:

- `enable` - set this to true to enable the feature
- `url` - set this to the URL to embed within the CRM container

> **Note**
> Within the `url`, you may include task and/or worker attributes via template variable substitution. To do so, use the format {{task.attribute_name_goes_here}} or {{worker.attribute_name_goes_here}} within the URL. If the attribute exists, the template variable is replaced with the contents of the attribute. Otherwise, the variable is replaced with an empty string.

There are additional settings you may also wish to configure:

- `should_display_url_when_no_tasks` - set this to true if a URL should be loaded when no task is selected
- `display_url_when_no_tasks` - set this to the URL to embed when no task is selected and the above setting is `true`

Once your updated flex-config is deployed, the feature is enabled and ready to use.

# how does it work?

The component keeps a array of each task and provides an iframe for each one. Based on the currently selected task, the component re-renders and modifies the CSS for the iframe to either hide or show based on whether its the currently selected task. Once the task is removed the iframe is removed.
