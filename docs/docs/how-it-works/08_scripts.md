---
sidebar_label: scripts
sidebar_position: 9
title: scripts
---

This package maintains some convenience scripts namely:

- [add-feature](#add-feature) - for adding a new feature to the template, adds all of the necessary boilerplate
- [rename-template](#renaming-template) - for renaming the plugin and serverless packages along with the serverless domain, typically used when making standalone plugins that still want to follow the template structure
- [remove-features](#removing-features) - for removing the features from the template, again typically used when making standalone plugins that still want to follow the template structure

---

# More Scripts Details

## Lint

ESLint is configured for the plugin, the serverless-functions package, and the serverless-schedule-manager package, using [Twilio Style](https://github.com/twilio-labs/twilio-style) as a base with some relaxations. When opening a pull request, the included GitHub workflows will run the linter, preventing merge if errors are present. Therefore, it is convenient to run the linter locally to identify any errors that you may need to fix ahead of time.

Before pushing changes, run the following command from the repository root dir to see the linter results across all packages.

```bash
npm run lint
```

Many linter issues can be fixed automatically. To do that, run this command:

```bash
npm run lint:fix
```

## Add feature

When adding new features to the template, some boilerplate is required. This script does all of that for you, specifically:

- Creates a feature directory under `feature-library`
- Adds an interface for feature configuration
- Adds a feature readme file
- Adds the feature to the `ui_attributes.common.json` config file
  - By default, the feature is added to the config with `enabled` set to `false`

After cloning the template, simply run the following command from the repository root dir.

```bash
npm install
npm run add-feature my-new-feature-name-goes-here
```

## Removing Features

You may want to remove all the features in the template and just want to use the template skeleton and serverless utilities

- You are starting a project and you don't want the features
- You may be creating a standalone plugin with a targeted feature set

There is a convenience script available to do this. After cloning the template, simply run the following command from the repository root dir.

```bash
npm install
npm run remove-features
```

## Renaming template

**NOTE** _renaming the template will make it a little more challenging to merge further template updates later_

You may want to rename the plugin and the serverless dependencies

- you are creating a standalone plugin and it needs to run side by side with other plugins using the template.

There is a convenience script available to do this. After cloning the template, simply run the following command from the repository root dir.

```bash
npm install
npm run rename-template My-Feature-Name
```

It will

- rename the plugin to `ps-template-my-feature-name`
  - update the plugin filenames and code references to `MyFeatureName`
  - _the prefix ps-template is used to easily identify plugins using the template format_
- rename the serverless-functions deployment name to `serverless-my-feature-name`
- reset the versions of these packages to `0.0.1`
- rename the variable used in flex-config to identify the serverless domain to `serverless_functions_domain_my_feature_name`
- rename references to the serverless domain within the plugin to match `serverless_functions_domain_my_feature_name`

## show-env-vars

convenience script for showing the SIDs of key services on your twilio account via the twilio cli

## setup-local-environment

convenience script for simplifying local setup and development, triggered as part of an `npm install` at the root of the repository

## generate-env

convenience script that does the same as setup-local-environment except it won't install npm packages again. Useful if you want to re-generate the serverless-functions env configuration from the current active profile in twilio-cli
