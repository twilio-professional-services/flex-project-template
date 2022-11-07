<a  href="https://www.twilio.com">
<img  src="https://static0.twilio.com/marketing/bundles/marketing/img/logos/wordmark-red.svg"  alt="Twilio"  width="250"  />
</a>
<br>
<br>

---

# Disclaimer
As Open Source Software from Twilio Professional Services, this project is not supported by Twilio Support. This software is to be considered "sample code", a Type B Deliverable, and is delivered "as-is" to the user. Twilio bears no responsibility to support the use or implementation of this software. In using this project, you are assuming ownership over the code and its implementation.

For bug reports and feature requests, please submit a Github Issue.

---

# Flex Project Template
The _Flex Project Template_ is a starting point for Flex solutions of any size.  It proposes recommendations around package structure and solution management.  It can be used for projects or simple standalone features.  

The primary aims of this template are to

1. Make building on Flex *easier*
2. Improve interoperability of plugin features by proposing some standardization
3. Accelerate project setup with options for asset and configuration versioning across multiple Twilio accounts

---

1. [Why a template?](#why-a-template)
    1. [One Plugin](#one-plugin-instead-of-a-collection-of-plugins)
    2. [Package Structure](#when-working-with-one-plugin-we-need-a-package-structure-to-organize-our-code)
    3. [Versioning](#manage-serverless-functions-with-plugins-and-flex-configuration-in-once-place)
    4. [Typescript](#use-typescript)
2. [Okay, but why a template for a standalone plugin?](#okay-but-why-a-template-for-a-standalone-feature)
3. [Okay tell me more, what does it do exactly?](#okay-tell-me-more-what-does-it-do-exactly)
    1. [flex-config](#flex-config)
    2. [infra-as-code](#infra-as-code)
    3. [plugin-flex-ts-template](#plugin-flex-ts-template)
    4. [plugin-flex-ts-template-v2](#plugin-flex-ts-template-v2)
    5. [serverless-functions](#serverless-functions)
    6. [web-app-examples](#web-app-examples)
    7. [scripts](#scripts)
    8. [.github](#github)
4. [Feature library Information](#feature-library-information)
5. [Setup Guides](#setup-guides)
    1. [Local Setup And Use](#local-setup-and-use)
        1. [Prerequisites](#prerequisites)
        2. [setup](#setup)
        3. [development notes](#development-notes)
    2. [Setup a project release pipeline](#setup-a-project-with-release-pipeline)
    3. [Using template for a standalone plugin](#using-template-for-a-standalone-plugin)
8. [More Scripts Details](#more-scripts-details)
    1. [Removing Features](#removing-features)
    2. [Renaming Template](#renaming-template)
9. [Change log](#changelog)


# Why a template?

*The Professional Services* team has worked with many customers since the original launch of Flex several years ago.  There are many ways to build with Flex but the collective experience has learned a few lessons that when followed, make working on Flex a lot easier.

### __One plugin instead of a collection of plugins.__

Working on flex with multiple plugins can work but as the number of plugins increases so does the likelihood that one plugin does something to the solution that another plugin was not expecting.  This can lead to some very difficult and time consuming troubleshooting.  By working on a single plugin, we can identify undesired behavior quickly and easily during development.

### __When working with one plugin we need a package structure to organize our code__

Working on a single plugin means that there is going to be a lot of code.  Therefore we need a package structure that allows developers to modularize their work but also easily pinpoint where their work overlaps with others.  This template proposes that package structure making distributed development across a team much easier.

### __Manage serverless functions with plugins and flex configuration in once place__

Ok it might seem obvious that you would want to do this but it might not be so obvious the most convenient way to do this, this template puts all those provisions in place so you can just use it.

### __Use Typescript__

Although not strictly necessary, TypeScript immediately affords development teams improved readability and error checking.

# Okay, but why a template for a standalone feature?

We often see development teams want to use solutions that are developed and publicly shared.  Typically these solutions are `Type B` [deliverables](#disclaimer).  As a result, consumers of these solutions often look to take ownership by rewriting the code and they typically start that by organizing the code into the package structure for a single plugin solution.  By following the template structure and **standardizing** the approach, it reduces the overhead for development teams to utilize the sample code and accelerates their ability to harden it for their own needs.

It also makes reuse of the serverless work that support a lot of plugins a lot easier.

# Okay tell me more, what does it do exactly?

Well the template provides a means to version control the [Flex Configuration](#flex-config), [the plugin code](#plugin-flex-ts-template-v2) itself as well as the supporting [serverless functions](#serverless-functions).  There is also a solution to manage [task router configuration](#infra-as-code). The infrastructure as code is a bit more involved to setup and we are currently working on making that easier but there are guides available for the sample provided [here](https://www.twilio.com/blog/intro-to-infrastructure-as-code-with-twilio-part-1).  There is also an example yaml file for building a release pipeline using github actions.

The template comes with a [library of example features](#feature-library-information) that cover a lot of typical extensions to Flex.  These features can easily be turned on or off or simply just removed by leveraging the [scripts](#scripts) provided.  If you use the scripts to [remove all the features](#removing-features), you will be left with just the structure of the template plus some handy utilities and serverless functions.

You might be asking why would i want the serverless functions? Well you may be aware already, Twilio accounts have a maximum API concurrency limit of 100.  Some specific APIs have their own specific rate limit and so its [best practice](https://support.twilio.com/hc/en-us/articles/360044308153-Twilio-API-response-Error-429-Too-Many-Requests-) to handle the 429 responses that can come back.  The serverless functions provide an example of how to do this in the serverless and plugin layer.  There are also operations in there that improve the quality of the Flex solution, for example, you can update task attributes using an [ETAG](https://www.twilio.com/docs/taskrouter/api/task#task-version) to improve transaction safety and this isnt currently available on the front end sdk.

At the root of the repository you will find the following packages

- [flex-config](#flex-config)
- [infra-as-code](#infra-as-code)
- [plugin-flex-ts-template](#plugin-flex-ts-template)
- [plugin-flex-ts-template-v2](#plugin-flex-ts-template-v2)
- [serverless-functions](#serverless-functions)
- [serverless-schedule-manager](#serverless-schedule-manager)
- [web-app-examples](#web-app-examples)
- [scripts](#scripts)
- [.github](#github)

### **flex-config**

This package manages a json artifact that can be used to version configuration elements on a per-twilio-account basis. We can think of this as allowing us to configure, dev, qa, test, production or any other environments individually. This configuration relates specifically to the the configuration for flex discussed [here](https://www.twilio.com/docs/flex/developer/ui/configuration) and works by injecting the custom object into ui_attributes within the flex configuration object. The plugin is then able to reference these variables. The first example being, hosting the domain name of the associated serverless-functions.

*NOTE* All changes are additive, that is to say, they are deep merged with whatever exists on the environment, never overwriting and only adding configuration when it doesn't exist.  This means we can ensure configuration exists as part of a release but then safely manage it on the environment over the lifetime of the solution, without worrying about subsequent releases overriding any changes made to the environment in between releases.

More details on the flex-config package can be found [here](/flex-config/README.md);

### **infra-as-code**

This package is a legacy initiative to leverage pulumi in managing twilio configuration artifacts such as taskrouter entities. This package is a functional methodology and was setup to represent a typically vanilla flex account thats just been initialized. This package has not been maintained as the intention is to move towards a similar solution using the terraform provider, however what has been setup and used before is available for anyone looking to use it in the interim. More details on how to use this can be found [here](https://www.twilio.com/blog/intro-to-infrastructure-as-code-with-twilio-part-1). Currently there are no dependencies in this package that need to be used and is here only for reference. Feel free to remove this if not utilized.

### **plugin-flex-ts-template**

This package is the actual flex plugin and a structure is already laid out that makes it a lot easier to work in a distributed development model. More details of the package structure are discussed [over here](plugin-flex-ts-template-v2/README.md) the plugin has a library of examples that can be turned on or off, or if desired can be removed completely with little overhead. The utilities in this package are designed around the associated serverless-functions and leverage the associated flex-config.

### **plugin-flex-ts-template-v2**

This package is identical in purpose to the `plugin-flex-ts-template` except its intended for flex v2 projects. The intention is when kicking off a project or feature the owner would fork the repository as a template, then delete the plugin version they are not using.

### **serverless-functions**

This package manages the serverless functions that the _plugin-flex-ts-template_ is dependent on. In this package there are a suite of services already available to use, some of which are simply wrappers around existing twilio APIs but with added resilience around retrying given configurable parameters. These retry mechanisms are particularly useful when a twilio function needs to orchestrate multiple twilio APIs to perform an overall operation. It should be noted twilio functions still have a maximum runtime and therefore careful consideration of retries should be employed for each use case. This does however provide improved resiliency and performance when 429s, 412s or 503s occur.

### **serverless-schedule-manager**

This package manages the serverless functions specific to the _schedule-manager_ feature. This package is separate from the `serverless-functions` package due to the actual schedule manager configuration being part of this serverless package--the entire service is re-deployed upon each configuration publish. If you are deploying the schedule-manager feature, you will need to also deploy this package using the instructions in the [schedule-manager readme](plugin-flex-ts-template-v2/src/feature-library/schedule-manager/README.md). If you are not deploying the `schedule-manager` feature, this service will not be used and does not need to be deployed.

### **web-app-examples**

This package contains web application examples that build off feature functionality found within the plugin templates. These examples utilize building applications with `React` and interact with various endpoints within the `serverless-functions` package.

### **scripts**

this package maintains some convenience scripts namely

- [rename-template](#renaming-template) - for renaming the plugin and serverless packages along with the serverless domain, typically used when making standalone plugins that still want to follow the template structure
- [remove-features](#removing-features) - for removing the features from the template, again typically used when making standalone plugins that still want to follow the template structure


### **.github**

Lastly, this package manages the github action workflows - with one example being setup for a dev account where this template is maintained. Upon commits to _main_; _flex-config_, _plugin-flex-ts-template_ and _serverless-functions_ are all deployed on the associated environment, as controlled by the environment variables in github actions. The underlying scripts can easily be moulded for use in alternative release management tools.

---

## Feature library Information

| Feature | Description | Flex V1 Plugin |  Flex V2 Plugin |  Further Config Required |
| --------| ----------- | ------- | ----------| ----------- |
| Activity Reservation Handler | _synchronize agent activities to reservation states_ | [Yes](plugin-flex-ts-template/src/feature-library/activity-reservation-handler/README.md) | [Yes](plugin-flex-ts-template-v2/src/feature-library/activity-reservation-handler/README.md)| ✅ | 
| Activity Skill Filter  | _manage visibility for activities based on agent skills_ | [Yes](plugin-flex-ts-template/src/feature-library/activity-skill-filter/README.md) | [Yes](plugin-flex-ts-template-v2/src/feature-library/activity-skill-filter/README.md) |  |
| Callbacks and Voicemail  | _introduce support for callback and voicemail tasks_ | [Yes](plugin-flex-ts-template/src/feature-library/callbacks/README.md) | [Yes](plugin-flex-ts-template-v2/src/feature-library/callback-and-voicemail/README.md) |  ✅ |
| Caller ID  | _provide agents with means to select their caller id when dialing out_ | [Yes](plugin-flex-ts-template/src/feature-library/caller-id/README.md) | [Yes](plugin-flex-ts-template-v2/src/feature-library/caller-id/README.md) |  |
| Chat to Video Escalation  | _provide agents ability to elevate a chat conversation to a video conversation with screen sharing_ | No | [Yes](plugin-flex-ts-template-v2/src/feature-library/chat-to-video-escalation/README.md) | ✅ |
| Chat Transfer  | _introduce chat transfer functionality for agents_ | [Yes](plugin-flex-ts-template/src/feature-library/chat-transfer/README.md) | [Yes](plugin-flex-ts-template-v2/src/feature-library/chat-transfer/README.md) | ✅ |
| Conference (external) | _provide agents the ability to conference in external numbers_ | No | [Yes](plugin-flex-ts-template-v2/src/feature-library/conference/README.md) |  |
| Device Manager | _provide agents the ability to select the audio output device_ | No | [Yes](plugin-flex-ts-template-v2/src/feature-library/device-manager/README.md) |  |
| Dual Channel Recording | _automatically record both inbound and outbound calls in dual channel_ | No | [Yes](plugin-flex-ts-template-v2/src/feature-library/dual-channel-recording/README.md) | ✅ |
| Enhanced CRM Container   | _optimize the CRM container experience_ | [Yes](plugin-flex-ts-template/src/feature-library/enhanced-crm-container/README.md) | [Yes](plugin-flex-ts-template-v2/src/feature-library/enhanced-crm-container/README.md) |
| Internal Call (Agent to Agent)  | _provide agents the ability to dial each other_ | No | [Yes](plugin-flex-ts-template-v2/src/feature-library/internal-call/README.md) | ✅ |
| Override Queue Transfer Directory | _a template for modifying the transfer directories_ | [Yes](plugin-flex-ts-template/src/feature-library/override-queue-transfer-directory/README.md) | No |   |
| Omni Channel Management | _method for mixing chat and voice channels_ | [Yes](plugin-flex-ts-template/src/feature-library/omni-channel-capacity-management/README.md) | [Yes](plugin-flex-ts-template-v2/src/feature-library/omni-channel-capacity-management/README.md)|   |
| Pause Recording | _provide agents the ability to temporarily pause and resume call recording_ | No | [Yes](plugin-flex-ts-template-v2/src/feature-library/pause-recording/README.md) |  |
| Schedule Manager | _a flexible, robust, and scalable way to manage open and closed hours for Twilio Flex applications_ | No | [Yes](plugin-flex-ts-template-v2/src/feature-library/schedule-manager/README.md) | ✅ |
| Scrollable Activities | _allow the scrolling of the activities list_ | [Yes](plugin-flex-ts-template/src/feature-library/scrollable-activities/README.md) | [Yes](plugin-flex-ts-template-v2/src/feature-library/scrollable-activities/README.md) |  |
| Supervisor Barge Coach | _introduce advanced supervisor barge and coach features_ | [Yes](plugin-flex-ts-template/src/feature-library/supervisor-barge-coach/README.md) | [Yes](plugin-flex-ts-template-v2/src/feature-library/supervisor-barge-coach/README.md) |   |
| Supervisor Capacity | _allow supervisors to update worker capacity configuration within Flex_ | No | [Yes](plugin-flex-ts-template-v2/src/feature-library/supervisor-capacity/README.md) |   |
| Teams View Filters | _adds additional filtering options to the supervisor teams view_ | No | [Yes](plugin-flex-ts-template-v2/src/feature-library/teams-view-filters/README.md) |   |


---

# Setup Guides

The following are guides to instruct the user how to leverage this template for each of the following use cases, they are focused around use of the flex V2 plugin.

## Local Setup and use

### Prerequisites
- you are running nodes v16 or above
- twilio cli 5.2.1 or above is [installed](https://www.twilio.com/docs/twilio-cli/getting-started/install)
- twilio flex plugins 6.0.2 or above is [installed](https://www.twilio.com/docs/flex/developer/plugins/cli/install#install-the-flex-plugins-cli)
- twilio serverless plugin 3.0.4 or above is [installed](https://www.twilio.com/docs/labs/serverless-toolkit/getting-started#install-the-twilio-serverless-toolkit)
- twilio profiles:list has an active account set.
- have the twilio auth token for your account ready

### Setup
1. Clone the repository
2. cd into the repository and execute the following (this installs all sub-project package dependencies and generates .env configuration for you)
```bash
npm install
```
3. follow the prompt and provide your api key
4. Run the serverless and plugin locally
```bash
npm run start:local
```

### development notes
When developing locally, flex config is overriden by anything in your [appConfig.js](/plugin-flex-ts-template-v2/public/appConfig.js).  Note appConfig is only applicable when running the plugin locally but you can edit this file to toggle features on and off for your locally running webserver, you can also tweak the api enddpoint for your serverless functions if you need to.

When running the plugin locally, this template has been setup to pair the plugin with the serverless functions also running locally on localhost:3001, the serverless functions can be debugged by attaching your debugger to the node instance.  The following is a sample entry for ".vscode/launch.json" to connect vscode for debugging

```json
{
	"version": "0.2.0",
	"configurations": [
		{
			"address": "localhost",
			"localRoot": "${workspaceFolder}/serverless-functions",
			"name": "Attach To Serverless Remote",
			"port": 9229,
			"remoteRoot": "${workspaceFolder}/serverless-functions",
			"request": "attach",
			"skipFiles": [
				"<node_internals>/**"
			],
			"type": "node"
		}
	]
}
```

---

## Setup a project with release pipeline

1. Fork the template and give it a name
2. checkout the repository and run
```bash
npm install
```
2. *OPTIONAL* remove the features if not desired; from the root folder of a checkout of your new repository run
```bash
npm run remove-features
```
3. *OPTIONAL* you may want to rename the template; from the root folder of a checkout of your new repository run
```bash
npm rename-template <template-name>
```
4. *OPTIONAL* if the rename-template script was not used, you may want to delete the plugin version thats not in use.
5. If the features were not removed, Review `flex-config/ui-attributes.common.json` and set the feature flags to enabled or disabled based on your preference.  Some features require further configuration or dependency setup, you can consult the [Feature library Information](#feature-library-information) for further details. 
6. For the environment you want to setup, edit the related `serverless/.env.<env-name>` file, ensuring at a minimum that the *General* settings match the SIDs of the intended environment. Some features require supporting workflow sids so if they are being used, ensure the dependencies are setup. You can consult the [Feature library Information](#feature-library-information) for further details. Enabling these features can also be done later.
7. Ensure the proper destination account is active in the twilio cli
```bash
twilio profiles:list
```
8. Do a one time manual deploy of the serverless functions into your account
```bash
cd serverless-functions && twilio serverless:deploy
```
9. Copy the domain name from the deployment details in step 5 and update `serverless_functions_domain` inside `ui_attributes.<env-name>.json` and edit the remaining config as appropriate. In github, go to your project settings -> secrets and add a secret for each variable, `TWILIO_ACCOUNT_SID_DEV`, `TWILIO_AUTH_TOKEN_DEV`, `TWILIO_API_KEY_DEV`, `TWILIO_API_SECRET_DEV`.  If this is the first environment being setup, you'll also need to add `PLUGIN_FOLDER` which is set to the folder name of the flex plugin you are deploying.  For example "plugin-flex-ts-template-v2" or potentially whatever its been renamed to.

![alt text](scripts/screenshots/github-secrets.png)

10. You can now take your preferred steps to push all your changes to main, based on the [github actions script](.github/workflows/flex_deploy_dev.yaml) your serverless, flex-config and plugin will be deployed to your twilio account.
11. To add more account configuration for higher accounts, repeat steps 6-10, for automated deploys to higher level environments, create additional copies of the [github actions script](.github/workflows/flex_deploy_dev.yaml)


# Using template for a standalone plugin

1. Fork the template and give it a name
2. Remove the features; from the root folder of a checkout of your new repository run
```bash
npm install
npm run remove-features
```
3. Rename the template; from the root folder of a checkout of your new repository run
```bash
npm rename-template <template-name>
```
4. *Optionally* manually clear the serverless_domain_name in [ui_attributes.dev.json](/flex-config/ui_attributes.dev.json)
5. *Optionally* you may want to tidy up your readme at this point or do it later 
6. *Optionally* you may want to remove the trigger for automated releases in the [github actions script](/.github/workflows/flex_deploy_dev.yaml) by removing the main branch trigger.
7. Push your changes to your repository - this is your new baseline
8. You can follow the instructions for [local development setup](#local-setup-and-use) and then [adding a feature](/plugin-flex-ts-template-v2/README.md#adding-a-feature)


---

# More Scripts Details

## Removing Features

(the following is only applicable when using the flex v2 plugin)

You may want to remove all the features in the template and just want to use the template skeleton and serverless utilities
 - You are starting a project and you don't want the features
 - You may be creating a standalone plugin with a targeted feature set

There is a convenience script available to do this.  After cloning the template, simply run the following command from the repository root dir.

```bash
npm install
npm run remove-features
```

---

## Renaming template

(the following is only applicable when using the flex v2 plugin)

**NOTE** *renaming the template will make it a little more challenging to merge further template updates later*

You may want to rename the plugin and the serverless dependencies
  - you are creating a standalone plugin and it needs to run side by side with other plugins using the template.

There is a convenience script available to do this.  After cloning the template, simply run the following command from the repository root dir.

```bash
npm install
npm run rename-template My-Feature-Name
```

It will
- rename the plugin to `ps-template-my-feature-name`
  - update the plugin filenames and code references to `MyFeatureName`
  - _the prefix ps-template is used to easily identify plugins using the template format_
- remove the flex v1 plugin (assuming its not to be used)
- rename the serverless-functions deployment name to `serverless-my-feature-name`
- reset the versions of these packages to `0.0.1`
- rename the variable used in flex-config to identify the serverless domain to `serverless_functions_domain_my_feature_name`
- rename references to the serverless domain within the plugin to match `serverless_functions_domain_my_feature_name`

# CHANGELOG

- 1.0.1
    1. Updated flex-config deploy to never overwrite existing config, adding values only when they don't exist.
    2. Updated readmes with instructions for various use cases
    3. Updated remove-features scripts to account for schedule manager


