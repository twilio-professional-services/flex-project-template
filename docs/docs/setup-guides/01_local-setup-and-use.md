---
sidebar_label: Run Flex Locally
sidebar_position: 2
title: Run Flex Locally
---

### Prerequisites

- you are running node v16 or above
- twilio cli 5.5.0 or above is [installed](https://www.twilio.com/docs/twilio-cli/getting-started/install) (`twilio --version`)
- twilio flex plugins 6.1.1 or above is [installed](https://www.twilio.com/docs/flex/developer/plugins/cli/install#install-the-flex-plugins-cli) (`twilio plugins`, `twilio plugins:install @twilio-labs/plugin-flex@latest`)
- twilio serverless plugin 3.0.4 or above is [installed](https://www.twilio.com/docs/labs/serverless-toolkit/getting-started#install-the-twilio-serverless-toolkit) (`twilio plugins` `twilio plugins:install @twilio-labs/plugin-serverless@latest`)
- `twilio profiles:list` has an active account set.
- have the twilio auth token for your account ready (you can find this in the [Twilio Console](https://console.twilio.com/))

:::info Feature Limitation
the admin panel is disabled by default when working locally. See the [admin panel docs](/feature-library/admin-ui) for more informatioon
:::

:::caution Feature Functionality
 some features may not be functional without a deployment of the taskrouter conofiguration and studio flows. It is recommended to do at least one initial deploy to your environment using the [Deploy Flex github action script](/setup-guides/deploy-to-hosted-flex)
:::

### Setup

1. Follow the steps to do an initial [deploy to hosted flex](/setup-guides/deploy-to-hosted-flex) at least once
2. Clone the new repository that you just created
``` bash
git clone <repo-url>
```
3. make sure the twilio cli has the correct account set to active, if not create one

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

:::caution Development Gotcha
When developing locally, Flex config is overridden by anything in your `plugin-flex-ts-template-v2/public/appConfig.js`. appConfig is only applicable when running the plugin locally, so you can edit this file to toggle features on and off for your locally running web server. You can also tweak the api endpoint for your serverless functions if you need to.
:::

:::info Development Tip!
When running the plugin locally, this template has been set up to pair the plugin with the serverless functions also running locally on localhost:3001. The serverless functions can be debugged by attaching your debugger to the node instance. The following is a sample entry for ".vscode/launch.json" to connect vscode for debugging

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
      "skipFiles": ["<node_internals>/**"],
      "type": "node"
    }
  ]
}
```
:::
