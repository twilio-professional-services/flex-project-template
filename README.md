# twilio-proserv-flex-project-template

## What is it?
This repository provides development teams with a starting point for flex projects.  It can simply be used by teams looking for ideas on how to manage development assets and configuration for a flex project.  It can also be used as an educational tool to help expedite developers getting familiar with development patterns within Flex Plugins.

This repository is really intended for anyone to use and is as much an educational tool as it is a template for development as it is a library of commonly built features for Twilio Flex.  It's most valuable though, when used for large, complex flex customizations.

In short the template provides:
- a pattern for distributed development
- a pattern to support multiple environments
- a pattern for coupling serverless code and flex account configuration versioning with plugin versioning
- an example github actions for CI/CD configuration
- a library of references to help developers find examples and implementation patterns
- a suite of ready to use tools for commonly leverage twilio APIs e.g. updateTaskAttributes or getQueues
- a set of examples for implementing retry handling at both the front end and serverless layers of the code

## Package Overview

At the root of the repository you will find the following packages
- flex-config
- infra-as-code
- plugin-flex-ts-template
- serverless-functions
- .github

these packages are coupled together to provide a means of versioning these artifacts together, providing a robust method for building a release pipeline across multiple environments.

__flex-config:__ this package manages a json artifact that can be used to version configuration elements on a per-twilio-account basis.  We can think of this as allowing us to configure, dev, qa, test, production or any other environments indivdually.  This configuration relates specifically to the the configuration for flex discussed [here](https://www.twilio.com/docs/flex/developer/ui/configuration) and works by injecting the custom object into ui_attributes within the flex configuration object.  The plugin is then able to reference these variables.  The first example being, hosting the domain name of the associated serverless-functions.

__infra-as-code:__ this package is a legacy package of a previous initiative to leverage pulumi to manage twilio configuration artifacts such as taskrouter entities.  This package is a functional methodology and was setup to represent a typicaly vanilla flex account thats just been initialized.  This package has not been maintained as the intention is to move towards a similar solution using the terraform provider, however what has been setup and used before is available for anyone looking to use it for immediate needs.  More details on how to use this can be found [here](https://www.twilio.com/blog/intro-to-infrastructure-as-code-with-twilio-part-1).  Currently there are no dependencies in this package that need to be used and is here only for reference.  Feel free to remove this if not utilized.

__plugin-flex-ts-template:__ this package is the actual flex plugin and a structure is already laid out that makes it a lot easier to work in a disributed development model.  More details of the package structure are discussed [over here](plugin-flex-ts-template/README.md) but just now the imporant thing to understand is that the plugin has a library of examples that can be turned on or off, or if desired can be removed completely with little overhead.  The utilities in this package are designed around the associated serverless-functions and leverage the associated flex-config.

__plugin-flex-ts-template-v2:__ this package is identical in purpose tot he plugin-flex-ts-template except its intended for flex v2 projects. This package is still a work in progress as we migrate the feature libraries over. It is functional as a package structure though.  The intention is when kicking off a project the owner would fork the repository then delete the plugin version they are not using.

__serverless-functions:__ this package manages the serverless functions that the _plugin-flex-ts-template_ is dependent on.  In this package there are a suite of services already available to use, some of which are simply wrappers around existing twilio APIs but with added resiliancy around retrying given configurable parameters.  These retry mechanisms are particularly useful when a twilio function needs to orchestrate multiple twilio APIs to perform an overall operation.  It should be noted twilio functions still have a maximum runtime and therefore careful consideration of retries should be employed for each use case.  This does however provided improved resiliency and performance when 429s, 412s or 503s occur.

__.github__ lastly this package manages the github action workflows - with one example being setup for a dev account where this template is maintained.  Upon commits to *main*; _flex-config_, _plugin-flex-ts-template_ and _serverless-functions_ are all deployed on the associated environment, as controlled by the environment variables in github actions.  The underly scripts can easily be used in alternative release management tools.

## Further Feature library Information

- [Activity Skill Filter](plugin-flex-ts-template/src/feature-library/activity-skill-filter/README.md)
- [Callbacks](plugin-flex-ts-template/src/feature-library/callbacks/README.md) 
- [Caller ID](plugin-flex-ts-template/src/feature-library/caller-id/README.md)
- [Chat Transfer](plugin-flex-ts-template/src/feature-library/chat-transfer/README.md)
- [Enhanced CRM Container](plugin-flex-ts-template/src/feature-library/enhanced-crm-container/README.md)
- [Override Queue Transfer Directory](plugin-flex-ts-template/src/feature-library/override-queue-transfer-directory/README.md)
- [Salesforce Click To Dial](plugin-flex-ts-template/src/feature-library/salesforce-click-to-dial/README.md)
- [Scrollable Activities](plugin-flex-ts-template/src/feature-library/scrollable-activities/README.md)
- [Supervisor Barge Coach](plugin-flex-ts-template/src/feature-library/supervisor-barge-coach/README.md)
- [Activity Reservation Handler](plugin-flex-ts-template/src/feature-library/activity-reservation-handler/README.md)


## local setup

1. Clone the repository
    > ```git clone https://github.com/twilio-professional-services/twilio-proserv-flex-project-template.git```
2. cd into the repository and execute (this installs all sub-project dependencies and creates two new .env files for the next step)
    > ```npm install```
3. Edit both ```serverless-functions/.env``` and ```flex-config/.env```
  - Review the SIDs in the .env files and update with the appropriate ones from your own account.  If you are using any features from the feature library, ensure you have read the appropriate readme for given feature and any dependencies that those features require are setup.  All variables under general should be set and if no features are being used, the rest can be ignored. 
4. Deploy serverless functions into your account
    > ```cd serverless-functions && twilio serverless:deploy```
5. Copy the domain name from the deployment details in step 4 and update ```flex-config/ui_attributes.dev.json```
6. Ensure the proper destination account is active in the twilio cli
    > ```twilio profiles:list```
7. With selected account, deploy the configuration
    > ```cd flex-config && npm run deploy:dev```
8. Begin local run of flex plugin
    > ```cd plugin-flex-ts-template && twilio flex:plugins:start```


## Disclaimer 
This template is the evolution of multiple implementations and every effort has been made to make sure this template has been built to a high standard.  **However** this template does come with **no warranty** and if you chose to use this template we encourage you to test anything you use or built to make sure it is suitable for **you**.  This effort has largely been a side project, and feedback is welcome but no commitment can be made at this time for turning any issues around.
