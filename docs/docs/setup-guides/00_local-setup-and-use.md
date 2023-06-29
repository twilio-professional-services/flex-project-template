---
sidebar_label: Local Setup & Use
sidebar_position: 1
title: Local Setup & Use
---

### Prerequisites

- you are running node v16 or above
- twilio cli 5.5.0 or above is [installed](https://www.twilio.com/docs/twilio-cli/getting-started/install) (`twilio --version`)
- twilio flex plugins 6.1.1 or above is [installed](https://www.twilio.com/docs/flex/developer/plugins/cli/install#install-the-flex-plugins-cli) (`twilio plugins`, `twilio plugins:install @twilio-labs/plugin-flex@latest`)
- twilio serverless plugin 3.0.4 or above is [installed](https://www.twilio.com/docs/labs/serverless-toolkit/getting-started#install-the-twilio-serverless-toolkit) (`twilio plugins` `twilio plugins:install @twilio-labs/plugin-serverless@latest`)
- `twilio profiles:list` has an active account set.
- have the twilio auth token for your account ready (you can find this in the [Twilio Console](https://console.twilio.com/))

_NOTE_ the admin panel will *not* be functional when working locally as [appConfig supersedes](#development-notes) the hosted config and the admin panel works directly with the hosted config.

_NOTE_ some features may not be functional without a deployment of the taskrouter conofiguration and studio flows. It is recommended to do at least one initial deploy to your environment using the [release pipeline](/setup-guides/deploy-to-hosted-flex)


### Setup

1. [Generate a new repository based on the template](https://github.com/twilio-professional-services/flex-project-template/generate)
2. Clone the new repository that you just created

- (Optionally) after creating your repo you may also want to attach the history to your new repository for future updates - details [here](/setup-guides/managing-future-updates-from-the-template)

3. make sure the twilio cli has the correct account set to active

```bash
twilio profiles:list
```

4. cd into the repository and execute the following (this installs all sub-project package dependencies and generates .env configuration for you)

```bash
npm install
```

5. follow the prompt and provide your auth token
6. Run the serverless functions and plugin locally by running

```bash
npm start
```

### development notes

When developing locally, Flex config is overridden by anything in your `plugin-flex-ts-template-v2/public/appConfig.js`. Note: appConfig is only applicable when running the plugin locally, so you can edit this file to toggle features on and off for your locally running web server. You can also tweak the api endpoint for your serverless functions if you need to.

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
