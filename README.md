<a  href="https://twilio-professional-services.github.io/flex-project-template/">
<img  src="https://static0.twilio.com/marketing/bundles/marketing/img/logos/wordmark-red.svg"  alt="Twilio"  width="250"  />
</a>
<br>

---

# Flex Project Template

The _Flex Project Template_ is a starting point for Flex solutions of any size. It proposes recommendations around package structure and solution management. It can be used for large projects or simple standalone features.

You can have the solution running locally with little overhead or have a development pipeline setup without even doing a checkout.

The primary aims of this template are

1. To make iteratively building on Flex _easier_
2. Improve interoperability of plugin features by proposing some standardization
3. Massively accelerate project setup with options for asset and configuration versioning across multiple Twilio accounts

For more overview information around the methodology of the template, please visit the [How it works](https://twilio-professional-services.github.io/flex-project-template/how-it-works/overview) section of the documentation site.

## Documentation Site

The [Flex Project Template Documentation Site](https://twilio-professional-services.github.io/flex-project-template/) contains comprehensive documentation regarding usage, features, utility scripts, and more. Check it out!

---

1. [Feature library Information](#feature-library-information)
2. [Setup Guides](#setup-guides)
   1. [Local Setup And Use](#local-setup-and-use)
      1. [Prerequisites](#prerequisites)
      2. [setup](#setup)
      3. [development notes](#development-notes)
      4. [Adding history to your repository](#adding-history-to-your-repository)
      5. [Taking future updates](#taking-future-updates-from-the-template)
   2. [Setup a project release pipeline (Recommended ~5 mins)](#setup-a-project-with-release-pipeline-recommended)
   3. [Deploying to hosted Flex without a release pipeline (Not Recommended ~20-30 minutes)](#deploying-to-hosted-flex-without-a-release-pipeline-not-recommended)
   4. [Using template for a standalone plugin](#using-template-for-a-standalone-plugin)

## Feature library Information

For a full list of features that come with the template, please visit the [Feature Overview](https://twilio-professional-services.github.io/flex-project-template/feature-library/overview) section of the documentation site.

# Setup Guides

The following are guides to instruct the user how to leverage this template for each of the following use cases.

## Local Setup and use

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

### development notes

When developing locally, Flex config is overridden by anything in your [appConfig.js](/plugin-flex-ts-template-v2/public/appConfig.example.js). Note: appConfig is only applicable when running the plugin locally, so you can edit this file to toggle features on and off for your locally running web server. You can also tweak the api endpoint for your serverless functions if you need to.

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

![alt text](scripts/screenshots/get-repository-commit-id-01.png)

then clicking copy on the copy-id button of the commit

![alt text](scripts/screenshots/get-repository-commit-id-02.png)

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

---

## Setup a project with release pipeline (Recommended)

For instructions on setting up a project with a release pipeline, please visit the [Setup a release pipeline](https://twilio-professional-services.github.io/flex-project-template/setup-guides/setup-release-pipeline) section of the documentation site.

## Deploying to hosted Flex without a release pipeline (Not Recommended)

For instructions on deploying to hosted Flex manually, please visit the [Manual Flex Deployment](https://twilio-professional-services.github.io/flex-project-template/setup-guides/deploy-to-flex-manual) section of the documentation site.

# Using template for a standalone plugin

For instructions on using the template as a standalone plugin, please visit the [Standalone Plugin Usage](https://twilio-professional-services.github.io/flex-project-template/setup-guides/standalone-plugin-usage) section of the documentation site.
