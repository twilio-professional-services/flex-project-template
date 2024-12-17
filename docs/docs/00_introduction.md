---
sidebar_label: Introduction
sidebar_position: 0
slug: /
title: "Flex Project Template"
---

<img src="img/logos/flex-text-lightmode.png#gh-light-mode-only" width="275" alt="Twilio Flex" />
<img src="img/logos/flex-text-darkmode.png#gh-dark-mode-only" width="275" alt="Twilio Flex" />

The _Flex Project Template_ is a starting point for Flex solutions of any size. It provides a methodology for managing all the key assets of a Twilio Flex solution:

- It can be used for large projects or simple standalone features
- Many of the most common features requested by Flex customers [are already packaged in the template](/feature-library/overview)
- Each feature is self-contained and easily removed if desired  
- Features can be turned on and off using an [adminstration panel](/feature-library/admin-ui)
- You can [deploy this solution and use it to build in just a few minutes](/getting-started/install-template) by providing your account SID, API key, and API secret.

## Why use this template?

The Twilio platform is a robust suite of tools that can be orchestrated together to create incredible custom solutions. The biggest challenge is how to automatically configure and orchestrate these different tools together from an single source of truth. This is the problem the template aims to resolve.

The template provides a means to manage all of the assets which make up a Flex solution. This aggregates the work _Twilio Professional Services_ have done to show how different features can be robustly implemented on the Flex platform. It can take new Flex developers from 0 to 100 by putting them right in the position of developing feature enhancements instead of worrying about how to manage assets and dependencies on the platform.

Furthermore, with the rich library of examples and conventions, developers can quickly see how to approach different problems on the platform by seeing working code that they can easily reverse engineer.

### Flex Plugin Library

If you are just looking to add common contact center functionality to Flex, we recommend evaluating whether plugins from the [Flex Plugin Library](https://www.twilio.com/docs/flex/developer/plugins/plugin-library) fit your use case. These plugins are maintained and supported by Twilio, and many are derived from the most popular features included in the template.

Using plugins from the Plugin Library reduces the custom code footprint and maintenance burden of your solution, however, they cannot be customized, and they cannot be deployed or configured via a CI/CD pipeline as the template can. They may also conflict with your custom code that modifies the same Flex actions or components. Depending on your use case, you may wish to use only the template, or only plugins from the Plugin Library, or a mix of both.

If you plan to use plugins from the Plugin Library alongside this template, you should [remove the corresponding template feature(s)](https://twilio-professional-services.github.io/flex-project-template/building/feature-management/remove-features) to prevent conflicts.

## How do I get started?

Installing the template in your Twilio account is fast and easy. [Follow this step-by-step guide to install the template](/getting-started/install-template) in under 10 minutes.

When you are ready to customize and extend your Flex solution with the template, [get started building with the template](/building/getting-started)!