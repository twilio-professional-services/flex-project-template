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

### Setup

1. [Generate a new repository based on the template](https://github.com/twilio-professional-services/flex-project-template/generate)
2. Clone the new repository that you just created

- (Optionally) after creating your repo you may also want to attach the history to your new repository for future updates - details [here](#adding-history-to-your-repository)

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

### Development Notes

When developing locally, Flex config is overridden by anything in your [appConfig.js](https://github.com/twilio-professional-services/flex-project-template/blob/main/plugin-flex-ts-template-v2/public/appConfig.example.js). Note: appConfig is only applicable when running the plugin locally, so you can edit this file to toggle features on and off for your locally running web server. You can also tweak the api endpoint for your serverless functions if you need to.

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

---

### Adding history to your repository

As outlined on [github docs](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template), when creating a new repository from a template, you will be creating a repositroy with no history. One of the benefits of using the template this way instead of forking is that you can make it private.

This means however, if you later want to take updates it can be difficult, but there is a solution. Attaching the history back into your repository allows you to take future updates with ease. You can do this with the following commands on your clone repository. Note, this is simplest to do when first creating your repo but can be done at any time, if doing at a later date BE CAREFUL as this will have downstream challanges with any branches you've created which will also have to be resolved.

```bash
git remote add upstream https://github.com/twilio-professional-services/flex-project-template.git
git fetch upstream
git rebase --onto <commit-id-from-template-when-cloning> <initial-commit-id-of-cloned-template> <branch-name>
```

where commit id from the template can be found by clicking on the commmit history

![alt text](/img/guides/get-repository-commit-id-01.png)

then clicking copy on the copy-id button of the commit

![alt text](/img/guides/get-repository-commit-id-02.png)

Similarly, the initial commit of the cloned template can be found in the same way.

Finally `branch-name` can be main or an alternative branch name if you are performing the operation there instead.

You then need to push this rebased history onto your branch

```bash
git push --force
```

And thats it, your repo now has the history!

### Taking future updates from the template

At a future date, you may want to grab the updates on the original template if you have added the history as mentioned above you can do this with the following commands

```bash
git checkout -b template-updates
git remote add flex-template https://github.com/twilio-professional-services/flex-project-template.git
git pull flex-template main
```

this will grab all the updates from the original template and apply them to your branch. You will of course have to manage any conflicts but if you have added the history correctly, this shouldnt be too complex. From here you can merge the changes into your parent branch as you see fit.
