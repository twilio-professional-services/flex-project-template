---
sidebar_label: Overview
sidebar_position: 1
title: How does it work?
---

The Twilio platform is a suite of tools that can be threaded together to create incredible custom solutions.  The biggest challenge here is the gap in tools readily available to automatically configure and thread these different tools together from an single image. 

Well that's where the template comes in.  It provides a means to version control the following assets which make up a flex solution, all from a single image.  By doing this we can aggregate a lot of work developers have done to show how many [different features](/feature-library/overview) can be robustly implemented on the Flex platform.  It can take developers from 0 to 100 by putting them right in the position of developing feature enhancements instead of worrying about the headache of how to manage assets and dependencies on the platform.  Furthermore, with the rich library of examples and conventions, developers can quickly see how to approach different problems on the platform by seeing working code that they can easily reverse engineer.

Visit the following links to see more information on each asset.

 - [flex configuration - aka "environment variables"](/how-it-works/flex-config), 
 - [the plugin code aka "the presentation layer"](/how-it-works/plugin-flex-ts-template-v2) 
 - [serverless functions aka "the backend"](/how-it-works/serverless-functions).
 - [twilio account configuration aka "flex dependencies" like task router and studio flows](/how-it-works/infra-as-code).
 - [release management via github actions](/how-it-works/github)
 - [web-app-examples](/how-it-works/web-app-examples)

To see this template in action, you can [deploy it to your account with just an Account SID, API key and an API Secret](https://twilio-professional-services.github.io/flex-project-template/setup-guides/deploy-to-hosted-flex)


It's worth noting, the template comes with a [library of example features](/feature-library/overview) that cover a lot of typical extensions to Flex. The template creates a system of encapsulation and self discovery for each feature.  As a result, features can be identified and removed just by deleting a folder. Alternatively, if you use the scripts to [remove all the features](/how-it-works/scripts#removing-features), you will be left with just the structure of the template plus some handy utilities and serverless functions.

