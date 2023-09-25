---
sidebar_position: 4
title: How does it work?
---

The Twilio platform is a suite of tools that can be threaded together to create incredible custom solutions.  The biggest challenge here is the gap in tools readily available to automatically configure and thread these different tools together from an single image. 

Well that's where the template comes in.  It provides a means to version control the following assets which make up a flex solution, all from a single image.  By doing this we can aggregate a lot of work developers have done to show how many [different features](/feature-library/overview) can be robustly implemented on the Flex platform.  It can take developers from 0 to 100 by putting them right in the position of developing feature enhancements instead of worrying about the headache of how to manage assets and dependencies on the platform.  Furthermore, with the rich library of examples and conventions, developers can quickly see how to approach different problems on the platform by seeing working code that they can easily reverse engineer.

Visit the following links to see more information on each asset.

 - [flex configuration - aka "environment variables"](#flex-config)
 - [the plugin code aka "the presentation layer"](#plugin-flex-ts-template-v2)
 - [serverless functions aka "the backend"](#serverless-functions)
 - [twilio account configuration aka "flex dependencies" like task router and studio flows](#infra-as-code)
 - [web-app-examples](#web-app-examples)

To see this template in action, you can [deploy it to your account with just an Account SID, API key and an API Secret](/getting-started/install-template)


It's worth noting, the template comes with a [library of example features](/feature-library/overview) that cover a lot of typical extensions to Flex. The template creates a system of encapsulation and self discovery for each feature.  As a result, features can be identified and removed just by deleting a folder. Alternatively, if you use the scripts to [remove all the features](/building/feature-management/remove-features), you will be left with just the structure of the template plus some handy utilities and serverless functions.

## docs

This package is responsible for maintaining the documentation for the project template, and is the source code for this live site.

This website is built using [Docusaurus 2](https://docusaurus.io/), in hopes of building better organized documentation around what the Flex Project Template is, how to get started and build with it, and provide a starting point for customers to document their functionality.

The live documentation site can be found [here](https://twilio-professional-services.github.io/flex-project-template/), but can also be run locally by executing the following at the root directory of the template (after running `npm i` in the `/docs` folder):

```
npm run start:docs
```

## flex-config

This package manages a json artifact that can be used to version configuration elements on a per-twilio-account basis. We can think of this as allowing us to configure, dev, qa, test, production or any other environments individually. This configuration relates specifically to the the configuration for flex discussed [here](https://www.twilio.com/docs/flex/developer/ui/configuration) and works by injecting the custom object into ui_attributes within the flex configuration object. The plugin is then able to reference these variables. The first example being, hosting the domain name of the associated serverless-functions.

The scripts work by merging the common attributes with the environment specifc attributes and then deploying them as part of the release pipeline.

_NOTE_ there are two mechanisms for managing the flex-config.

1. manging the files via the [administration panel](/feature-library/admin-ui).  This is the default mechanism and as a result a deploy from the pipeline will only add new elements, it will not overwrite existing configuration.
2.  manging completely through what is in version control.  Select `true` when launching the github actions script to `Overwrite config set by Admin UI Panel?`

Currently it only supports managing `ui_attributes` properties and `taskrouter_skills` within the [Flex UI Configuration](https://www.twilio.com/docs/flex/developer/ui/configuration).

- `ui_attributes` managed per environment
- `taskrouter_skills` managed across all environments


### To Use Locally (typically not neccessary)

_NOTE_ although not typically neccessary, these instructions are intended for completeness.  Local development should use `plugin-flex-ts-template-v2\public\appConfig.js`. For shared environments please use the github release pipeline scripts.

1. Make sure the dependent modules are installed

```bash
npm install
```

2. Create your .env file

```bash
cp .env.example .env
```

3. have a twilio api key and secret for your account
   - follow this [guide](https://www.twilio.com/docs/glossary/what-is-an-api-key#how-can-i-create-api-keys) to setup an API key if you dont have one

4. Add `TWILIO_ACCOUNT_SID` and `TWILIO_API_KEY` and `TWILIO_API_SECRET` values to the `.env` file

5. Review/Edit the `taskrouter_skills.json` and ensure the skills match the ones you want to deploy. This is used on every environment to deploy a common set of skills. Note the skills in the file will be merged with any skills existing in the environment.

6. cp the `ui_attributes.example.json` to `ui_attributes.local.json`.

```bash
cp ui_attributes.example.json ui_attributes.local.json
```

7. Run `npm run deploy:local` to update the Flex configuration.

### To use with release pipeline

follow the instructions for setting up the release pipeline [here](/getting-started/install-template)

### Configuring skills

The `taskrouter_skills.json` file defines skills that should be automatically deployed. The skills in the file will be merged with any skills existing in the environment. By default this is empty. 

*Note that its important to use skill names without spaces* 

Here is an example of how you can populate this file:

```json
[
  {
    "minimum": null,
    "multivalue": false,
    "name": "billing",
    "maximum": null
  },
  {
    "minimum": null,
    "multivalue": false,
    "name": "support",
    "maximum": null
  },
  {
    "minimum": null,
    "multivalue": false,
    "name": "offline_work",
    "maximum": null
  }
]
```

## infra-as-code

This package contains the available infrastructure as code solutions, right now the only one in use is terraform, which is the default.

### Terraform

The terraform solution uses a combination of

- Twilio Functions Assets to store the terraform state using an encryption key
- twilio cli to identify known and critical sids that can be injected into the terraform definition and import existing state
- terraform configuration to manage studio flows and task router configuration that the features depend on.

It uses the [twilio terraform provider](https://github.com/twilio/terraform-provider-twilio) which at time of writing does not support data sources.

The main ambition with this setup is to lower the barrier for entry and get development off the ground, the persistence of the terraform provider can be moved to another storage location as desired. Instructions on that piece still to come.

When running the release pipeline it will import and generate the state based on what is on the account but only with relation to resources declared in the configuration. Any resources not in the configuration will be ignored.

This solution pushes the configuration and will overwrite anything in your environment so please use with care.

#### Adding resources

When adding resources in the usual way to the terraform config, its also to add an associated entry into the action.yaml file in the `infra-as-code/terraform/environments/default/import_internal_state.sh' file that identifies this resource for import. Examples are given for each type of resource. Failure to do so may result in a collision on successive releases.

## plugin-flex-ts-template-v2

This is the _Twilio Professional Services_ Flex Plugin that accompanies the Flex Project Template.

This plugin defines a package structure to make distributed development easier when augmenting Flex with custom features and behaviors.

## serverless-functions

This package manages the serverless functions that the _plugin-flex-ts-template-v2_ package is dependent on. In this package there are a suite of services already available to use, some of which are simply wrappers around existing twilio APIs but with added resilience around retrying given configurable parameters. These retry mechanisms are particularly useful when a twilio function needs to orchestrate multiple twilio APIs to perform an overall operation. It should be noted twilio functions still have a maximum runtime and therefore careful consideration of retries should be employed for each use case. This does however provide improved resiliency and performance when 429s, 412s or 503s occur.

## serverless-schedule-manager

This package manages the serverless functions specific to the _schedule-manager_ feature. This package is separate from the `serverless-functions` package due to the actual schedule manager configuration being part of this serverless package--the entire service is re-deployed upon each configuration publish. If you are deploying the schedule-manager feature, you will need to also deploy this package using the instructions in the [schedule-manager feature page](/feature-library/schedule-manager). If you are not deploying the `schedule-manager` feature, this service will not be used and does not need to be deployed.

## web-app-examples

This package contains web application examples that build off feature functionality found within the plugin templates. These examples utilize building applications with `React` and interact with various endpoints within the `serverless-functions` package.

### Applications

- [Twilio Video Demo App](https://github.com/twilio-professional-services/flex-project-template/tree/main/web-app-examples/twilio-video-demo-app) - aimed at standing up a video room solution rapidly, building off of the [Chat to Video Escalation](/feature-library/chat-to-video-escalation) feature