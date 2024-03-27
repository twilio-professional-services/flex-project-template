---
sidebar_label: Run the template locally
title: Run the template locally
---

If you wish to modify the template in any way, you will need to set up your development environment to run the template locally using the following steps.

## Prerequisites

- you are running node v18 or above
- twilio cli 5.18.0 or above is [installed](https://www.twilio.com/docs/twilio-cli/getting-started/install) (`twilio --version`)
- twilio flex plugins 6.3.1 or above is [installed](https://www.twilio.com/docs/flex/developer/plugins/cli/install#install-the-flex-plugins-cli) (`twilio plugins`, `twilio plugins:install @twilio-labs/plugin-flex@latest`)
- twilio serverless plugin 3.1.6 or above is [installed](https://www.twilio.com/docs/labs/serverless-toolkit/getting-started#install-the-twilio-serverless-toolkit) (`twilio plugins` `twilio plugins:install @twilio-labs/plugin-serverless@latest`)
- `twilio profiles:list` has an active account set.
- have the twilio auth token for your account ready (you can find this in the [Twilio Console](https://console.twilio.com/))
- If you are running Windows, ensure you are using Git Bash to execute the commands when working with the template, rather than Command Prompt or PowerShell.

:::caution Feature Functionality
 some features may not be functional without a deployment of the TaskRouter configuration and studio flows. It is recommended to do at least one initial deploy to your environment using the [Deploy Flex GitHub workflow](install-template)
:::

## Setup

1. Follow the steps to do an initial [deploy to hosted Flex](install-template) at least once
2. Clone the new repository that you just created
``` bash
git clone <repo-url>
```
3. Make sure the Twilio CLI has the correct account set to active, if not create one

```bash
twilio profiles:list
```
4. cd into the repository and execute the following (this installs all sub-project package dependencies and generates .env configuration for you)

```bash
npm install
```
5. follow the prompt and provide your auth token

6. Run the serverless functions and plugin together locally by running the following at the top level of the checkout

```bash
npm start
```

:::info Feature Limitation
the admin panel is disabled by default when working locally. See the [admin panel docs](/feature-library/admin-ui) for more information
:::

:::caution Development Gotcha
When developing locally, Flex config is overridden by anything in your `plugin-flex-ts-template-v2/public/appConfig.js`. appConfig is only applicable when running the plugin locally, so you can edit this file to toggle features on and off for your locally running web server. You can also tweak the api endpoint for your serverless functions if you need to.
:::
