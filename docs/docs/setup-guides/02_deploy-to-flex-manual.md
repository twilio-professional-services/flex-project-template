---
sidebar_label: Manual Flex Deployment
sidebar_position: 3
title: Deploying to hosted Flex without a release pipeline (Not Recommended)
---

_~20-30 minutes_

For the below steps, where `<environment>` is referenced, you may use `dev`, `test`, `qa`, or `prod`.

First, deploy the serverless functions:

```bash
cd serverless-functions
npm run deploy
```

If you plan to use the schedule manager feature, deploy its serverless functions as well:

```bash
cd ../serverless-schedule-manager
npm run deploy
```

Next, populate the serverless domains deployed above into the config:

```bash
cd ..
npm run populate-missing-placeholders <environment>
```

If you customized `custom_data` in `appConfig.js` while running locally, and would like to deploy with those settings, be sure to make the same changes in your `flex-config/ui_attributes.<environment>.json` file as well.

Deploy the configuration:

```bash
cd flex-config
npm run deploy:<environment>
```

Start the plugin deployment:

```bash
cd ../plugin-flex-ts-template-v2
npm run deploy -- --changelog "Initial deploy" --description "Flex project template"
```

After your deployment runs you will receive instructions for releasing your plugin from the bash prompt. You can use this or skip this step and release your plugin from the Flex plugin dashboard here https://flex.twilio.com/admin/plugins

For more details on deploying your plugin, refer to the [deploying your plugin guide](https://www.twilio.com/docs/flex/plugins#deploying-your-plugin).
