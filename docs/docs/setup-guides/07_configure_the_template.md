---
sidebar_label: Configure the template
sidebar_position: 7
title: Flex Project Template Configuration
---
import GithubOverrideConfig from '../../static/img/guides/github-override-config.png';

## The Flex-Config (Front End Configuration)

### hosted configuration
Generally speaking, when running the *flex-project-template* it loads configuration from the [hosted flex configuration endpoint](https://www.twilio.com/docs/flex/developer/config/flex-configuration-rest-api#ui_attributes). When the *flex-project-template* is deployed, a [`custom_data`](#the-custom_data-object) object is injected into ui_attributes that manages configuration for each feature within the template.

### local configuration
When running flex locally, the configuration from [hosted flex configuration](https://www.twilio.com/docs/flex/developer/config/flex-configuration-rest-api#ui_attributes) is loaded but the configuration in `plugin-flex-ts-template-v2/public/appConfig.js` overrides anything in hosted configuration. Note the appConfig.js config is only used locally and has no bearing on a deploy or when on hosted flex.

:::note Initial setup
The `appConfig.js` file is created for you as part of the initial local environment setup script, which executes when running `npm install` in the root template directory. The file is automatically populated with the feature config from the `flex-config/ui_attributes.common.json` file at the time of creation, as long as the file does not already exist.
:::

### config management

#### the custom_data object
The template maintains the configuration that is deployed to [hosted flex configuration](https://www.twilio.com/docs/flex/developer/config/flex-configuration-rest-api#ui_attributes) in version control under the [`flex-config`](/how-it-works/flex-config) folder.  Here you will find `ui_attributes.common.json` file containing the main configuration set.  

At the time of a GitHub action script deploy of the flex template, when an environment is provided, a new file is generated from `ui_attributes.example.json` and it is called `ui_attributes.<env-name>.json`.  After creating this file any placeholder values in the file are replaced as part of the GitHub deployment scripts.  The contents of this file are merged over the top of the `ui_attributes.common.json` file and the output creates the final configuration set that is pushed to the [hosted flex configuration api](https://www.twilio.com/docs/flex/developer/config/flex-configuration-rest-api#ui_attributes).

#### the data model

The custom_data model that lives in ui_attributes follows this pattern

```json
{
"custom_data": {
    "features": {
      "<feature-name>": {
        "enabled": true,
        // other feature attributes
      }
    }
}
```

:::note Developer Note
  if using the add-feature script. The feature name provided may include hyphens, however the feature name used in the custom_data will replace the hyphens with underscores to make the variable name javascript parser compliant
:::

Ultimately, enablement of each feature is managed by this variable as it appears in the [hosted flex configuration](https://www.twilio.com/docs/flex/developer/config/flex-configuration-rest-api#ui_attributes) (or appConfig.js if running [locally](#local-configuration))

### updating the config

There are two strategies for managing the configuration set which are mutually exclusive

#### admin ui

You can use the [admin-ui feature](/feature-library/admin-ui), which is the default management style, to manage the configuration.  

:::tip Developer Tip 

When running [locally](#local-configuration), this feature directly ignores what is in `appConfig.js` and shows only what is in [hosted flex configuration](https://www.twilio.com/docs/flex/developer/config/flex-configuration-rest-api#ui_attributes) or what has been overridden using the [per-worker feature overrides](/feature-library/admin-ui#how-does-it-work).  As a result this can cause confusion and for that reason is disabled by default when running flex project template locally.

Please note if worker overrides have been created, these will take precedence whether the admin-ui feature is enabled or not

::: 

#### infrastructure as code (version control)

Alternatively you can also choose to manage the configuration via version control.  As the default management style is to use the [admin-ui feature](/feature-library/admin-ui) when doing a deploy of [`flex-config`](/how-it-works/flex-config) it will only deploy the *net new* changes by merging the config with that which is hosted already.  To override this behavior and deploy exactly what is in version control you can use the "Override config set by Admin UI Panel" when deploying via the github actions script.

<img src={GithubOverrideConfig} style={{width: 250}} />
<br/><br/>


:::tip Developer Tip

It is generally a good idea to disable the admin ui feature if you are planning to use this style of configuration management. This is because it can create confusion to have changes made in the admin ui overwritten by the deploy

::: 

### environment specific controls

As [explained](#the-custom_data-object) a deploy will create an intermediary step of generating an environment specific file from the example file.  If you wish to create custom configuration for a specific environment you can create that file manually by copying the example ui_attributes and using the name `ui_attributes.<env-name>.json` and placing any environment specific settings in there.  You can then commit it to version control and anything in this file will take precedence over the common file. Using this approach also needs to be in the context of the use of [config management strategy](#version-control)


## Serverless Configuration
The template runs a script as part of the GitHub Actions deploy process (`populate-missing-placeholders`) to automatically identify and populate any missing configuration and environment variables used by template features. This includes items such as the TaskRouter workspace SID, Chat and Sync service SIDs, TaskRouter workflow SIDs, serverless domains, and more.

The automatic population of these environment variables is performed based on name-matched results from the Twilio CLI. If you wish to use different objects, or if the automatic population is failing, you may override this process.



When the `populate-missing-placeholders` script is run as part of the GitHub Actions deploy process, within the serverless package, a `.env.<environment name here>` file is used if present, or generated if not. Therefore, we can commit a `.env.<environment name here>` file, for example, `.env.dev`, to pre-define the environment variables. To do so, perform the following steps:

1. Within the serverless directory you wish to pre-define configuration for, copy [the example `.env.example` file](https://github.com/twilio-professional-services/flex-project-template/blob/main/serverless-functions/.env.example) to a new file named `.env.<environment name here>` (for example: `.env.dev`)
2. Populate the variables you wish to skip auto-population. **Important: Do not populate sensitive information such as auth tokens or API key secrets.** You may leave the placeholders for these items, and they will continue to be auto-populated securely.
3. For your safety, the `.gitignore` file in the repository root prevents all custom `.env.<my environment>` files from being committed. Once you have confirmed your new environment file does not contain any sensitive information, you will need to add it as an exclusion to the `.gitignore` file. You may do this by appending a line that contains the environment file name with a preceding `!` (for example: `!.env.dev`)
4. Now, you should be able to commit the environment file.

