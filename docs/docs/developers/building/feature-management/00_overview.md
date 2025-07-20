---
title: Overview
---

The feature-library directory of the Flex plugin is intended to be a suite of typical features added to Flex that can accelerate the launch of a Flex project by showing developers "how-to". Features can easily be turned on or off via the [flex-config](/building/template-utilities/configuration) - or they can easily be removed completely by removing the feature directory or using the [remove-features](/building/feature-management/remove-features) script.

Each feature in the feature library is self contained. Let's look at [caller-id](/feature-library/caller-id) as an example.

For this feature, we have a `custom-components` directory, containing components that are created for rendering within Flex (in this case, the Caller ID dropdown). Within the `flex-hooks` directory, we can see which hooks are used to hook in the behavioural changes to Flex. In this case, we can see hooks defined for the `StartOutboundCall` action, the `OutboundDialerPanel` component, the `pluginLoaded` event, and our own Redux `state` namespace.

![caller-id](/img/guides/caller-id.png)

Use the pages within this documentation section to understand the tooling around adding and removing features in the template.