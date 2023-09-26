---
sidebar_label: Getting started
title: Get started building with the template
---

The template includes a robust development environment to help you better manage the complexity of a customized Flex solution.

## Components

Several packages are included in the template. Each package has a distinct purpose:

| Package | Description |
|---------|-------------|
|docs|Docusaurus project that contains the documentation you are reading right now!|
|flex-config|Manages deployment of the Flex UI configuration, which contains the settings for each feature in the template.|
|infra-as-code|TaskRouter and Studio resource definitions for dependencies of template features. This allows managing these dependencies as code for easy deployment to an environment.|
|plugin-flex-ts-template-v2|Twilio Flex plugin that provides the front-end logic and UI.|
|serverless-functions|Back-end logic that the Flex plugin calls in order to securely access Twilio APIs without exposing credentials in the front-end. Also exposes functions for integrating template features outside of Flex, such as from Studio flows or other infrastructure.|

There may also be other packages within the repository that exist to support specific template features. See [package overview](/package-overview) for more details on each package.

## Configuration

When working with the template, it is important to understand how to configure the template locally, as well as how to deploy configuration changes to an environment.

When you first clone the template to your local machine, you will run an `npm install` script that configures the template. This script will set up the `.env` files for each package, which provides packages with configuration that differs per environment, such as the SIDs of dependencies, or the domain of serverless functions. It will also copy the common UI attributes from the flex-config package into the plugin's `public/appConfig.js` file, which is the configuration file used when running the Flex plugin locally _(the flex-config package is not used when running locally; it is used only in the deployed environment)_.

When the template is deployed to an environment, the configuration works slightly differently. The same `npm install` script is run during a deploy, so that `.env` files can be populated without requiring them to be committed with secrets. However, rather than using an `appConfig.js` in the plugin, the flex-config package is deployed. The deployed Flex plugin will use the configuration from the deployed flex-config package. In addition, the [admin-ui](/feature-library/admin-ui) feature allows admins to change the deployed flex-config from within the Flex UI.

To recap, while developing, you will manage plugin configuration for the locally running plugin from `public/appConfig.js`, but will need to make the same changes to the flex-config package in order for them to be deployed to your environment.

More details regarding configuration across the template are available on the [Configuration](template-utilities/configuration) page.

## Set up your local environment

Now that we have a basic understanding of the structure, let's get started!

1. If you have not already done an initial deployment of the template to your Twilio account, first [install the template](/getting-started/install-template) on your account.
2. Then, follow the steps to [run the template locally](/getting-started/run-locally).
3. [Set up your text editor](developer-setup) to make development more streamlined.
3. Optionally, if you'd like to be able to pull in updates to the template from upstream in the future, [add the upstream remote](merge-future-updates#pre-requisite-add-upstream-remote).