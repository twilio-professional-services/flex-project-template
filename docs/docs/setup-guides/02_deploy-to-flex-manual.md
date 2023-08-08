---
sidebar_label: Deploy from the command line
sidebar_position: 2
title: Deploy to hosted Flex from the command line (Not Recommended)
---

:::info Terraform

There are currently no steps provided for manually deploying terraform from your command line.  You can deploy terraform config independently from the github actions script `Deploy Terraform Only`

:::


_~20-30 minutes_

Complete the steps for [local setup and use](/setup-guides/local-setup-and-use)

- To deploy the serverless functions:

make sure you are using the correct twilio profile that matches your .env
```bash
cd serverless-functions
export env=`cat .env | grep ACCOUNT_SID | cut -d '=' -f 2`; export profile=`twilio profiles:list | grep true | cut -d ' ' -f 5`; echo -e 'serverless: \t' ${env}; echo -e 'profile: \t' ${profile}
```
after confirming they are the same

```bash
npm run deploy
```

- Next, to deploy the schedule manager feature, deploy its serverless functions as well:

make sure you are using the same twilio profile that matches your .env

:::caution CAUTION
this is not the same command to check the account sids
:::

```bash
cd ../serverless-schedule-manager
export env=`cat .env | grep ACCOUNT_SID | cut -d '=' -f 2`; export profile=`twilio profiles:list | grep true | cut -d ' ' -f 5`; echo -e 'schedule-manager: \t' ${env}; echo -e 'profile: \t' ${profile}
```

after confirming they are the same
```bash
npm run deploy
```
:::note heads up!
you may see an error like, "Unable to read from flex-config, fetching domain via API... Error: ENOENT: no such file or directory, open '../flex-config/ui_attributes.local.json'"

dont worry, its still falling back to the API to load the config
:::

- Next to deploy the flex config

:::info tip!
If you customized `custom_data` in `appConfig.js` while running locally, and would like to deploy with those settings, be sure to make the same changes in your `flex-config/ui_attributes.<environment>.json` file as well.
:::

Again, check the env matches your profile

```bash
cd ../flex-config/
export env=`cat .env | grep ACCOUNT_SID | cut -d '=' -f 2`; export profile=`twilio profiles:list | grep true | cut -d ' ' -f 5`; echo -e 'flex-config: \t' ${env}; echo -e 'profile: \t' ${profile}
```

if they match, run the deploy

```bash
npm run deploy
```

- Next to start the plugin deployment:

```bash
cd ../plugin-flex-ts-template-v2
npm run deploy -- --changelog "My manual deploy" --description "Flex project template"
```

After your deployment runs you will receive instructions for releasing your plugin from the bash prompt. You can use this or skip this step and release your plugin from the Flex plugin dashboard here https://flex.twilio.com/admin/plugins

For more details on deploying your plugin, refer to the [deploying your plugin guide](https://www.twilio.com/docs/flex/plugins#deploying-your-plugin).



