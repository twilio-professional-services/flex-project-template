---
sidebar_label: Override environment properties
sidebar_position: 7
title: Override environment properties
---

The template runs a script as part of the GitHub Actions deploy process (`populate-missing-placeholders`) to automatically identify and populate any missing configuration and environment variables used by template features. This includes items such as the TaskRouter workspace SID, Chat and Sync service SIDs, TaskRouter workflow SIDs, serverless domains, and more.

The automatic population of these environment variables is performed based on name-matched results from the Twilio CLI. If you wish to use different objects, or if the automatic population is failing, you may override this process.

## serverless-functions and serverless-schedule-manager

When the `populate-missing-placeholders` script is run as part of the GitHub Actions deploy process, within the serverless package, a `.env.<environment name here>` file is used if present, or generated if not. Therefore, we can commit a `.env.<environment name here>` file, for example, `.env.dev`, to pre-define the environment variables. To do so, perform the following steps:

1. Within the serverless directory you wish to pre-define configuration for, copy [the example `.env.example` file](https://github.com/twilio-professional-services/flex-project-template/blob/main/serverless-functions/.env.example) to a new file named `.env.<environment name here>` (for example: `.env.dev`)
2. Populate the variables you wish to skip auto-population. **Important: Do not populate sensitive information such as auth tokens or API key secrets.** You may leave the placeholders for these items, and they will continue to be auto-populated securely.
3. For your safety, the `.gitignore` file in the repository root prevents all custom `.env.<my environment>` files from being committed. Once you have confirmed your new environment file does not contain any sensitive information, you will need to add it as an exclusion to the `.gitignore` file. You may do this by appending a line that contains the environment file name with a preceding `!` (for example: `!.env.dev`)
4. Now, you should be able to commit the environment file.


## flex-config

To populate serverless domains into the Flex config: When the `populate-missing-placeholders` script is run as part of the GitHub Actions deploy process, within the flex-config package, a `ui_attributes.<environment name here>.json` file is used if present, or generated if not. Therefore, we can commit a `ui_attributes.<environment name here>.json` file, for example, `ui_attributes.dev.json`, to pre-define the serverless domains. To do so, perform the following steps:

1. Within the flex-config directory, copy [the example `ui_attributes.example.json` file](https://github.com/twilio-professional-services/flex-project-template/blob/main/flex-config/ui_attributes.example.json) to a new file named `ui_attributes.<environment name here>.json` (for example: `ui_attributes.dev.json`)
2. Populate the config you wish to skip auto-population.
3. Commit the file.