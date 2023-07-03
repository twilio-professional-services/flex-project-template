---
sidebar_label: Deploy with GitHub Actions (Recommended)
sidebar_position: 1
title: Deploy to hosted Flex - GitHub Actions (Recommended)
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
   - (Optional) after creating your repo you may also want to attach the history to your new repository for future updates - details [here](/setup-guides/managing-future-updates-from-the-template) - this can also be done later
2. Create a twilio api key and secret for your account follow this [guide](https://www.twilio.com/docs/glossary/what-is-an-api-key#how-can-i-create-api-keys) to setup an API key.
3. In github, navigate to the repository you created in step 1, click the settings tab -> environments -> "New Environment"
   
   - _NOTE_ if you are on the free tier, the repository will need to be public to use environments.  If you are on the free tier and still want to use a private repo you will need to clone the deploy script to have dedicated secrets per environment

   - add the 4 *secrets* for that environment
     - `TWILIO_ACCOUNT_SID` - the account sid you want to deploy to
     - `TWILIO_API_KEY` - the api key or key "sid" as its otherwise known
     - `TWILIO_API_SECRET` - the api secret
     - `TF_ENCRYPTION_KEY` this can be any string value you want

   - your environment secrets should look something like this (TF_ENCYPTION_KEY can be a repo or environment secret)
   ![image](/img/guides/github-secrets.png)

4. Login into Flex and make sure in the admin panel, the version of flex you are using meets the minimal version allowed by the plugin (at time of writing, Flex 2.x is minimum allowed)
5. _Optionally_ navigate to the flex console and enable the [Flex dialpad](https://console.twilio.com/us1/develop/flex/manage/voice?frameUrl=%2Fconsole%2Fflex%2Fvoice%3Fx-target-region%3Dus1) (this is required for some features)
6. Navigate over to github actions of your repository and select the `Deploy Flex` action script, _select the environment_ you want to deploy, check the boxes for;
   - `Is this the first release to the environment?`
   - `Deploy Terraform?`  (as *cautioned* above), 
   
7. Run the workflow.
   - this will deploy the assets to your environment with the default features enabled, See [Feature library Information](/feature-library/overview) for further details of whats enabled by default.
   - envrionment properties will be automatically populated based on the deployed Flex configuration, including service and workflow SIDs. See [override environment properties](/setup-guides/override-environment-properties) for information on how to influence this configuration.
 


