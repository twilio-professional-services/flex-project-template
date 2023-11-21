---
title: Local deployment
---

:::info Terraform
There are currently no steps provided for manually deploying Terraform from your command line.  You can deploy Terraform config independently from the GitHub actions script `Deploy Terraform Only`
:::

Time to complete: _~20-30 minutes_

Before following any of these steps, first complete the steps for [local setup and use](/getting-started/run-locally).

## Deploy add-ons

Some features, such as the `chat-to-video-escalation` feature and the `schedule-manager` feature, depend on add-on packages that need to be deployed. To do so:

First, make sure you are using the correct Twilio profile that matches your `schedule-manager` .env:

:::caution Caution
This is not the same command as above!
:::

```bash
export env=`cat addons/serverless-schedule-manager/.env | grep ACCOUNT_SID | cut -d '=' -f 2`; export profile=`node scripts/print-profile-account.mjs`; echo -e 'schedule-manager: \t' ${env}; echo -e 'profile: \t' ${profile}
```

Once you have confirmed they are the same, run the deployment:

```bash
npm run deploy-addons
```

## Deploy serverless functions

First, make sure you are using the correct Twilio profile that matches your .env:

```bash
cd serverless-functions
export env=`cat .env | grep ACCOUNT_SID | cut -d '=' -f 2`; export profile=`node ../scripts/print-profile-account.mjs`; echo -e 'serverless: \t' ${env}; echo -e 'profile: \t' ${profile}
```

:::tip Tip
If the accounts do not match, perform the following:
- If the profile account is correct, run `npm run postinstall -- --overwrite` in the template root directory to re-generate your .env files based on the selected profile.
- If the profile account is not correct, run `twilio profiles:use my_profile_name` to switch profiles.
:::

Once you have confirmed they are the same, run the deployment:

```bash
npm run deploy
```

## Deploy configuration

:::tip Tip!
If you customized `custom_data` in `appConfig.js` while running locally, and would like to deploy with those settings, be sure to make the same changes in your `flex-config/ui_attributes.local.json` file as well.
:::

Again, first double-check the .env matches your Twilio CLI profile:

```bash
cd ../flex-config/
export env=`cat .env | grep ACCOUNT_SID | cut -d '=' -f 2`; export profile=`node ../scripts/print-profile-account.mjs`; echo -e 'flex-config: \t' ${env}; echo -e 'profile: \t' ${profile}
```

If they match, continue:
1. Review/edit the `taskrouter_skills.json` file and ensure the skills match the ones you want to deploy. This is used on every environment to deploy a common set of skills. Note the skills in the file will be merged with any skills existing in the environment.
1. Review/edit the `ui_attributes.local.json` file and ensure the configuration matches what you want to deploy. Note the configuration in the file will be merged with both the `ui_attributes.common.json` file as well as any configuration existing in the environment.
1. Run `npm run deploy` to update the Flex configuration.

## Deploy Flex plugin

Now that the dependencies have been deployed, we may now deploy the Flex plugin:

```bash
cd ../plugin-flex-ts-template-v2
npm run deploy -- --changelog "My manual deploy" --description "Flex project template"
```

After your deployment runs you will receive instructions for releasing your plugin from the prompt. You can use this or skip this step and release your plugin from the [Flex plugin dashboard](https://flex.twilio.com/admin/plugins).

For more details on deploying your plugin, refer to the [deploying your plugin guide](https://www.twilio.com/docs/flex/plugins#deploying-your-plugin).