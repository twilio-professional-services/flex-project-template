<a  href="https://www.twilio.com">
<img  src="https://static0.twilio.com/marketing/bundles/marketing/img/logos/wordmark-red.svg"  alt="Twilio"  width="250"  />
</a>

# flex-project-template
This repository provides development teams with a starting point for Flex projects. It is intended to accelerate the setup of a project and provide robust examples of the most common features added to Flex.

The template provides:

- a pattern for distributed development
- a pattern to support multiple environments
- a pattern for coupling serverless code and flex account configuration versioning with plugin versioning
- an example github actions for CI/CD configuration
- a library of references to help developers find examples and implementation patterns
- a suite of ready to use tools for commonly leverage twilio APIs e.g. updateTaskAttributes or getQueues
- a set of examples for implementing retry handling at both the front end and serverless layers of the code

---

## Package Overview

At the root of the repository you will find the following packages

- [flex-config](#flex-config)
- [infra-as-code](#infra-as-code)
- [plugin-flex-ts-template](#plugin-flex-ts-template)
- [plugin-flex-ts-template-v2](#plugin-flex-ts-template-v2)
- [serverless-functions](#serverless-functions)
- [web-app-examples](#web-app-examples)
- [.github](#github)

These packages are coupled together to provide a means of versioning these artifacts as a single release, providing a robust method for building a release pipeline across multiple environments.

### **flex-config**

This package manages a json artifact that can be used to version configuration elements on a per-twilio-account basis. We can think of this as allowing us to configure, dev, qa, test, production or any other environments indivdually. This configuration relates specifically to the the configuration for flex discussed [here](https://www.twilio.com/docs/flex/developer/ui/configuration) and works by injecting the custom object into ui_attributes within the flex configuration object. The plugin is then able to reference these variables. The first example being, hosting the domain name of the associated serverless-functions.

### **infra-as-code**

This package is a legacy package of a previous initiative to leverage pulumi to manage twilio configuration artifacts such as taskrouter entities. This package is a functional methodology and was setup to represent a typicaly vanilla flex account thats just been initialized. This package has not been maintained as the intention is to move towards a similar solution using the terraform provider, however what has been setup and used before is available for anyone looking to use it for immediate needs. More details on how to use this can be found [here](https://www.twilio.com/blog/intro-to-infrastructure-as-code-with-twilio-part-1). Currently there are no dependencies in this package that need to be used and is here only for reference. Feel free to remove this if not utilized.

### **plugin-flex-ts-template**

This package is the actual flex plugin and a structure is already laid out that makes it a lot easier to work in a disributed development model. More details of the package structure are discussed [over here](plugin-flex-ts-template/README.md) the plugin has a library of examples that can be turned on or off, or if desired can be removed completely with little overhead. The utilities in this package are designed around the associated serverless-functions and leverage the associated flex-config.

### **plugin-flex-ts-template-v2**

This package is identical in purpose to the `plugin-flex-ts-template` except its intended for flex v2 projects. The intention is when kicking off a project the owner would fork the repository as a template, then delete the plugin version they are not using.

### **serverless-functions**

This package manages the serverless functions that the _plugin-flex-ts-template_ is dependent on. In this package there are a suite of services already available to use, some of which are simply wrappers around existing twilio APIs but with added resiliancy around retrying given configurable parameters. These retry mechanisms are particularly useful when a twilio function needs to orchestrate multiple twilio APIs to perform an overall operation. It should be noted twilio functions still have a maximum runtime and therefore careful consideration of retries should be employed for each use case. This does however provided improved resiliency and performance when 429s, 412s or 503s occur.

### **web-app-examples**

This package contains web application examples that build off feature functionality found within the plugin templates. These examples utilize building applications with `React` and interact with various endpoints within the `serverless-functions` package.

### **.github**

Lastly, this package manages the github action workflows - with one example being setup for a dev account where this template is maintained. Upon commits to _main_; _flex-config_, _plugin-flex-ts-template_ and _serverless-functions_ are all deployed on the associated environment, as controlled by the environment variables in github actions. The underlying scripts can easily be moulded for use in alternative release management tools.

---

## Further Feature library Information

| Feature | Description | Flex V1 Plugin |  Flex V2 Plugin |
| --------| ----------- | ------- | ----------|
| Activity Reservation Handler | _synchronize agent activities to reservation states_     | [Yes](plugin-flex-ts-template/src/feature-library/activity-reservation-handler/README.md) | [Yes](plugin-flex-ts-template-v2/src/feature-library/activity-reservation-handler/README.md)|
| Activity Skill Filter  | _manage visibility for activities based on agent skills_ | [Yes](plugin-flex-ts-template/src/feature-library/activity-skill-filter/README.md) | [Yes](plugin-flex-ts-template-v2/src/feature-library/activity-skill-filter/README.md) |
| Callbacks and Voicemail  | _introduce support for callback and voicemail tasks_  | [Yes](plugin-flex-ts-template/src/feature-library/callbacks/README.md) | [Yes](plugin-flex-ts-template-v2/src/feature-library/callback-and-voicemail/README.md) |
| Caller ID  | _provide agents with means to select their caller id when dialing out_  | [Yes](plugin-flex-ts-template/src/feature-library/caller-id/README.md) | [Yes](plugin-flex-ts-template-v2/src/feature-library/caller-id/README.md) |
| Chat to Video Escalation  | _provide agents ability to elevate a chat conversation to a video conversation with screen sharing_  | No | [Yes](plugin-flex-ts-template-v2/src/feature-library/chat-to-video-escalation/README.md) |
| Chat Transfer  | _introduce chat transfer functionality for agents_  | [Yes](plugin-flex-ts-template/src/feature-library/chat-transfer/README.md) | [Yes](plugin-flex-ts-template-v2/src/feature-library/chat-transfer/README.md) |
| Conference (external) | _provide agents the ability to conference in external numbers_  | No | [Yes](plugin-flex-ts-template-v2/src/feature-library/conference/README.md) |
| Device Manager | _provide agents the ability to select the audio output device_  | No | [Yes](plugin-flex-ts-template-v2/src/feature-library/device-manager/README.md) |
| Enhanced CRM Container   | _optimize the CRM container experience_ | [Yes](plugin-flex-ts-template/src/feature-library/enhanced-crm-container/README.md) | [Yes](plugin-flex-ts-template-v2/src/feature-library/enhanced-crm-container/README.md) |
| Internal Call (Agent to Agent)  | _provide agents the ability to dial each other_ | No | [Yes](plugin-flex-ts-template-v2/src/feature-library/internal-call/README.md) |
| Override Queue Transfer Directory | _a template for modifying the transfer directories_ | [Yes](plugin-flex-ts-template/src/feature-library/override-queue-transfer-directory/README.md) | No |
| Omni Channel Management | _method for mixing chat and voice channels_ | [Yes](plugin-flex-ts-template/src/feature-library/omni-channel-capacity-management/README.md) | [Yes](plugin-flex-ts-template-v2/src/feature-library/omni-channel-capacity-management/README.md)
| Scrollable Activities | _allow the scrolling of the acitivies list_ | [Yes](plugin-flex-ts-template/src/feature-library/scrollable-activities/README.md) | [Yes](plugin-flex-ts-template-v2/src/feature-library/scrollable-activities/README.md)
| Supervisor Barge Coach | _introduce advanced supervisor barge and coach features_ | [Yes](plugin-flex-ts-template/src/feature-library/supervisor-barge-coach/README.md) | [Yes](plugin-flex-ts-template-v2/src/feature-library/supervisor-barge-coach/README.md) |
| Teams View Filters | _adds additional filtering options to the supervisor teams view_ | No | [Yes](plugin-flex-ts-template-v2/src/feature-library/teams-view-filters/README.md) |


---

## Local Setup and use

1. Clone the repository

```bash
git clone https://github.com/twilio-professional-services/flex-project-template.git
```

2. cd into the repository and execute (this installs all sub-project dependencies and creates two new .env files for the next step)
```bash
npm install
```
3. Edit both `serverless-functions/.env` and `flex-config/.env`

- Review the SIDs in the .env files and update with the appropriate ones from your own account. If you are using any features from the feature library, ensure you have read the appropriate readme for given feature and any dependencies that those features require are setup. All variables under general should be set and if no features are being used, the rest can be ignored.

4. Deploy serverless functions into your account
```bash
cd serverless-functions && twilio serverless:deploy
```
5. cd into the flex config directory
```bash
cd ../flex-config/
```
6. Copy the dev configuration file to a local environment config
```bash
cp ui_attributes.dev.json ui_attributes.local.json
```
7. Copy the domain name from the deployment details in step 4 and update `serverless_functions_domain` inside `ui_attributes.local.json` and edit the remaining config as appropriate
8. Ensure the proper destination account is active in the twilio cli
```bash
twilio profiles:list
```
9. With selected account, deploy the configuration
```bash
npm run deploy:local
```
10. Begin local run of flex plugin
```bash
cd ../plugin-flex-ts-template-v2 && twilio flex:plugins:start
```

## Disclaimer

This template is the evolution of multiple implementations and every effort has been made to make sure this template has been built to a high standard. **However** this template does come with **no warranty** and if you chose to use this template you are responsible for testing anything you use or build on top of it to make sure it is suitable for **you**. Feedback is welcome but no commitment can be made at this time for turning any issues around.
