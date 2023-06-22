---
sidebar_label: Setup a release pipeline
sidebar_position: 2
title: Setup a release pipeline
---

_~5 minutes_

1. Use the template to create your own repository
2. Nominate a Twilio account to act as one of dev, qa, test, prod (based on your use case)
3. Create a twilio api key and secret for your account follow this [guide](https://www.twilio.com/docs/glossary/what-is-an-api-key#how-can-i-create-api-keys) to setup an API key.
   - If you intend to have multiple environments, you will need an API Key/Secret for each account. You'll use this in the next step
4. In github, navigate to the repository you created in step 1, click the settings tab -> secrets -> actions -> Click the "New repository secret" button:
   - Add the following to select which plugin is released
     - `PLUGIN_FOLDER` - this is `plugin-flex-ts-template-v2` unless you are using the `rename-template` script
   - Add the following to choose deployment behavior
     - `OVERWRITE_CONFIG` - if using an infrastructure-as-code deployment approach, set this to `true` to use the config in the repository as the source of truth. Otherwise, set this to `false` to allow configuration via the admin UI.
   - For each environment add the 3 env variables for that environment, for example, if its dev you would add
     - `TWILIO_ACCOUNT_SID_DEV` - the account sid you want to deploy to
     - `TWILIO_API_KEY_DEV` - the account key or key "sid" as its otherwise known
     - `TWILIO_API_SECRET_DEV` - the account secret

![alt text](../../static/img/github-secrets.png)

6. Login into Flex and make sure in the admin panel, the version of flex you are using meets the minimal version allowed by the plugin
7. _Optionally_ navigate to the flex console and enable the [Flex dialpad](https://console.twilio.com/us1/develop/flex/manage/voice?frameUrl=%2Fconsole%2Fflex%2Fvoice%3Fx-target-region%3Dus1) (this is required for some features)
8. Navigate over to github actions of your repository and select the environment you want to deploy, then run the workflow.
   - this will deploy the four assets to your environment with the default features enabled, See [Feature library Information](#feature-library-information) for further details of whats enabled by default.
   - serverless-functions will auto-identify any missing environment variables for the default features. It is recommended you populate the [environment variables](https://github.com/twilio-professional-services/flex-project-template/blob/main/serverless-functions/.env.example) for each account and manage config in version control at a later date to remove any ambiguity.
   - flex-config will auto-identify the domain name for the deployed serverless-functions and schedule-manager. It is recommended you populate the [ui_attributes](https://github.com/twilio-professional-services/flex-project-template/blob/main/flex-config/ui_attributes.common.json) config and manage the domain names through version control at a later date to remove any ambiguity.
   - for full functionality, review the configuration steps for the disable features and make sure their dependencies are setup.
