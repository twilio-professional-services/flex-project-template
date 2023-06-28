---
sidebar_label: Deploy to hosted Flex
sidebar_position: 2
title: Deploy to hosted Flex
---


:::danger IMPORTANT UNDERSTANDING
These deploy steps will setup taskrouter configuration possibly overwriting resources that may already be there. 

If you do not want to overwrite any changes uncheck the `Deploy Terraform?` input box when running the github action to deploy flex

![image](/img/guides/github-trigger.png)

doing this however will mean some features will need manual setup, the steps of which can be found in the relevant documentation.

:::

:::info Resources affected



## TaskRouter

| Workflows | Task Queues | Activities | Task Channels |
------------|-------------|------------|---------------|
| `Asssign To Anyone`, `Chat Transfer`, `Callback`, `Internal Call` | `Everyone`, `Template Example Sales`, `Template Example Support`, `Internal Calls` | `Offline`, `Available`, `Unavailable`, `Break` | `Voice`, `Chat`|

## Studio

| Flows |
--------|
| `Voice IVR`, `Messaging Flow`, `Chat Flow` |

:::


Time to complete: _~8 minutes_

1. Use the template to [create your own repository](https://github.com/twilio-professional-services/flex-project-template/generate) 
   - (Optionally) after creating your repo you may also want to attach the history to your new repository for future updates - details [here](/setup-guides/managing-future-updates-from-the-template)
2. Nominate a Twilio account to act as one of dev, qa, test, prod (based on your use case)
3. Create a twilio api key and secret for your account follow this [guide](https://www.twilio.com/docs/glossary/what-is-an-api-key#how-can-i-create-api-keys) to setup an API key.
   - If you intend to have multiple environments, you will need an API Key/Secret for each account. You'll use this in the next step
4. In github, navigate to the repository you created in step 1, click the settings tab -> environments -> "New Environment"

   - Give it the name to match one of [dev, qa, test, prod]

   - add the 3 *secrets* for that environment
     - `TWILIO_ACCOUNT_SID` - the account sid you want to deploy to
     - `TWILIO_API_KEY` - the api key or key "sid" as its otherwise known
     - `TWILIO_API_SECRET` - the api secret

5. Create a project level secret for `TF_ENCRYPTION_KEY` this can be any string value you want
   - your environment secrets should look something like this 
   ![image](/img/guides/github-secrets.png)

6. Login into Flex and make sure in the admin panel, the version of flex you are using meets the minimal version allowed by the plugin (in this case Flex 2.x is minimum allowed)
7. _Optionally_ navigate to the flex console and enable the [Flex dialpad](https://console.twilio.com/us1/develop/flex/manage/voice?frameUrl=%2Fconsole%2Fflex%2Fvoice%3Fx-target-region%3Dus1) (this is required for some features)
8. Navigate over to github actions of your repository and select the environment you want to deploy, check the boxes for;
   - `Is this the first release to the environment?`
   - `Deploy Terraform?`  (as *cautioned* above), 
   
9. Run the workflow.
   - this will deploy the assets to your environment with the default features enabled, See [Feature library Information](/feature-library/overview) for further details of whats enabled by default.
   - serverless-functions will auto-identify any missing environment variables for the default features. It is recommended you populate the [environment variables](https://github.com/twilio-professional-services/flex-project-template/blob/main/serverless-functions/.env.example) for each account and manage config in version control at a later date to remove any ambiguity.
   - flex-config will auto-identify the domain name for the deployed serverless-functions and schedule-manager. It is recommended you populate the [ui_attributes](https://github.com/twilio-professional-services/flex-project-template/blob/main/flex-config/ui_attributes.common.json) config and manage the domain names through version control at a later date, again, to remove any ambiguity.

