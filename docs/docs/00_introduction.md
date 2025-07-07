---
sidebar_label: Introduction
sidebar_position: 0
slug: /
title: "Connie Documentation"
---

<img src="img/logos/connie-rtc-docs-logo.jpg" width="275" alt="ConnieRTC" />

The _Connie Realtime Center (aka ConnieRTC) is a comprehensive digital communication and engagment solution that provides advanced contact center capabilities to local nonprofit organizations and other community based organizations that provide missioin critical programs and services to people in-need. This documentation covers all the key components and features of the ConnieRTC platform:

- It can be used for large projects or simple standalone features
- Many of the most common features requested by Flex customers [are already packaged in the template](/feature-library/overview)
- Each feature is self-contained and easily removed if desired  
- Features can be turned on and off using an [administration panel](/feature-library/admin-ui)
- You can [deploy this solution and use it to build in just a few minutes](/getting-started/install-template) by providing your account SID, API key, and API secret.

## Why use this template?

The Twilio platform is a robust suite of tools that can be orchestrated together to create incredible custom solutions. The biggest challenge is how to automatically configure and orchestrate these different tools together from an single source of truth. This is the problem the template aims to resolve.

The template provides a means to manage all of the assets which make up a Flex solution. This aggregates the work _Twilio Professional Services_ have done to show how different features can be robustly implemented on the Flex platform. It can take new Flex developers from 0 to 100 by putting them right in the position of developing feature enhancements instead of worrying about how to manage assets and dependencies on the platform.

Furthermore, with the rich library of examples and conventions, developers can quickly see how to approach different problems on the platform by seeing working code that they can easily reverse engineer.

### Flex Plugin Library

If you are primarily looking to add common contact center functionality to Flex, we recommend starting with the plugins from the [Flex Plugin Library](https://www.twilio.com/docs/flex/developer/plugins/plugin-library) to support your use case. These plugins are maintained and supported by Twilio, and many are derived from the most popular features included in the template.

Using plugins from the Plugin Library reduces the custom code footprint and total cost of ownership of your solution. Please be aware they cannot be customized and must be deployed and configured manually via the Flex Admin user interface. In case you have already developed, or plan to develop, custom code that modifies Flex actions or components, it is necessary to validate that those modifications don’t conflict with the standard plugin(s) you are planning to deploy from the Plugin Library. Depending on your use case, you may wish to use only plugins from the Plugin Library, or only the template, or a mix of both.

If you plan to use plugins from the Plugin Library alongside this template, please [remove the corresponding template feature(s)](/building/feature-management/remove-features) to prevent conflicts.

## How do I get started?

Installing the template in your Twilio account is fast and easy. [Follow this step-by-step guide to install the template](/getting-started/install-template) in under 10 minutes.

When you are ready to customize and extend your Flex solution with the template, [get started building with the template](/building/getting-started)!