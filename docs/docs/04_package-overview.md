---
title: Package overview
---

Visit the following sections to see more information on each package.

 - [Flex configuration - aka "environment variables"](#flex-config)
 - [The plugin code - aka "the front-end"](#plugin-flex-ts-template-v2)
 - [Serverless functions - aka "the back-end"](#serverless-functions)
 - [Twilio account configuration - aka "Flex dependencies" like TaskRouter and Studio flows](#infra-as-code)
 - [Web app examples](#web-app-examples)

## docs

This package is responsible for maintaining the documentation for the project template, and is the source code for this live site.

This website is built using [Docusaurus 2](https://docusaurus.io/), in hopes of building better organized documentation around what the Flex Project Template is, how to get started and build with it, and provide a starting point for customers to document their functionality.

The live documentation site can be found [here](https://twilio-professional-services.github.io/flex-project-template/), but can also be run locally by executing the following at the root directory of the template (after running `npm i` in the `/docs` folder):

```
npm run start:docs
```

## flex-config

This package manages a json artifact that can be used to version configuration elements on a per-Twilio-account basis. We can think of this as allowing us to configure, dev, qa, test, production or any other environments individually. This configuration relates specifically to the the configuration for Flex discussed [here](https://www.twilio.com/docs/flex/developer/ui/configuration) and works by injecting the custom object into `ui_attributes` within the Flex configuration object. The plugin is then able to reference these variables, such as the domain name of the associated serverless-functions.

See [Configuration](/building/template-utilities/configuration) for details regarding how this package works and how to manage configuration.

## infra-as-code

This package contains the available infrastructure as code solutions, right now the only one in use is Terraform, which is the default.

### Terraform

The Terraform solution uses a combination of

- Twilio Serverless assets to store the Terraform state using an encryption key
- Twilio CLI to identify known and critical SIDs that can be injected into the Terraform definition and import existing state
- Terraform configuration to manage Studio flows and TaskRouter configuration that the features depend on.

It uses the [Twilio Terraform provider](https://github.com/twilio/terraform-provider-twilio) which at time of writing does not support data sources.

The main ambition with this setup is to lower the barrier for entry and get development off the ground, the persistence of the Terraform provider can be moved to another storage location as desired. Instructions on that piece still to come.

When running the release pipeline it will import and generate the state based on what is on the account but only with relation to resources declared in the configuration. Any resources not in the configuration will be ignored.

This solution pushes the configuration and will overwrite anything in your environment so please use with care.

#### Adding resources

When adding resources in the usual way to the Terraform config, its also necessary to add an associated entry into the action.yaml file in the `infra-as-code/terraform/environments/default/import_internal_state.sh' file that identifies this resource for import. Examples are given for each type of resource. Failure to do so may result in a collision on successive releases.

## plugin-flex-ts-template-v2

This is the _Twilio Professional Services_ Flex Plugin that accompanies the Flex Project Template.

This plugin defines a package structure to make distributed development easier when augmenting Flex with custom features and behaviors.

## serverless-functions

This package manages the serverless functions that the _plugin-flex-ts-template-v2_ package is dependent on. In this package there are a suite of services already available to use, some of which are simply wrappers around existing Twilio APIs but with added resilience around retrying given configurable parameters. These retry mechanisms are particularly useful when a Twilio function needs to orchestrate multiple Twilio APIs to perform an overall operation. It should be noted Twilio functions still have a maximum runtime and therefore careful consideration of retries should be employed for each use case. This does however provide improved resiliency and performance when 429s, 412s or 503s occur.

## serverless-schedule-manager

This package manages the serverless functions specific to the _schedule-manager_ feature. This package is separate from the `serverless-functions` package due to the actual schedule manager configuration being part of this serverless package--the entire service is re-deployed upon each configuration publish. If you are deploying the schedule-manager feature, you will need to also deploy this package using the instructions in the [schedule-manager feature page](/feature-library/schedule-manager). If you are not deploying the `schedule-manager` feature, this service will not be used and does not need to be deployed.

## web-app-examples

This package contains web application examples that build off feature functionality found within the plugin templates. These examples utilize building applications with `React` and interact with various endpoints within the `serverless-functions` package.

### Applications

- [Twilio Video Demo App](https://github.com/twilio-professional-services/flex-project-template/tree/main/web-app-examples/twilio-video-demo-app) - aimed at standing up a video room solution rapidly, building off of the [Chat to Video Escalation](/feature-library/chat-to-video-escalation) feature