---
sidebar_label: Run the template locally
title: Run the template locally
---

If you wish to modify the template in any way, you will need to set up your development environment to run the template locally using the following steps.

## Prerequisites

- Node.js 22 or above is installed
- Twilio CLI 6.1.0 or above is [installed](https://www.twilio.com/docs/twilio-cli/getting-started/install)
  - To check your currently installed version, run `twilio --version`
- Twilio CLI Flex plugin 7.1.2 or above is [installed](https://www.twilio.com/docs/flex/developer/plugins/cli/install#install-the-flex-plugins-cli)
  - To check your currently installed version, run `twilio plugins`
  - To install the latest version, run `twilio plugins:install @twilio-labs/plugin-flex@latest`
- Twilio CLI serverless plugin 3.3.0 or above is [installed](https://www.twilio.com/docs/labs/serverless-toolkit/getting-started#install-the-twilio-serverless-toolkit)
  - To check your currently installed version, run `twilio plugins`
  - To install the latest version, run `twilio plugins:install @twilio-labs/plugin-serverless@latest`
- `twilio profiles:list` has an active account set
- Have the Twilio auth token for your account ready (you can find this in the [Twilio Console](https://console.twilio.com/))
- If you are running Windows, ensure you are using Git Bash to execute the commands when working with the template, rather than `cmd` or PowerShell.
  - We also need to instruct `npm` to use Git Bash for executing scripts. To do so, run: `npm config set script-shell "C:\\Program Files\\git\\bin\\bash.exe"` (adjust as needed for the installed Git location)

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
5. Follow the prompt and provide your auth token

6. Run the serverless functions, Insights proxy, and plugin together locally by running the following at the top level of the repository

```bash
npm start
```

:::info Feature Limitation
The admin panel is disabled by default when working locally. See the [admin panel docs](/feature-library/admin-ui) for more information.
:::

:::caution Development Gotcha
When developing locally, Flex config is overridden by anything in your `plugin-flex-ts-template-v2/public/appConfig.js`. appConfig is only applicable when running the plugin locally, so you can edit this file to toggle features on and off for your locally running web server. You can also tweak the api endpoint for your serverless functions if you need to.
:::
