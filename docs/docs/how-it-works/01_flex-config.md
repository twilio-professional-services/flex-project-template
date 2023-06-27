---
sidebar_label: flex-config
sidebar_position: 2
title: flex-config
---

This package manages a json artifact that can be used to version configuration elements on a per-twilio-account basis. We can think of this as allowing us to configure, dev, qa, test, production or any other environments individually. This configuration relates specifically to the the configuration for flex discussed [here](https://www.twilio.com/docs/flex/developer/ui/configuration) and works by injecting the custom object into ui_attributes within the flex configuration object. The plugin is then able to reference these variables. The first example being, hosting the domain name of the associated serverless-functions.

---

The scripts work by merging the common attributes with the environment specifc attributes and then deploying them as part of the release pipeline.

_NOTE_ there are two mechanisms for managing the flex-config.

1. manging the files via the [administration panel](/feature-library/flex-v2/admin-ui).  This is the default mechanism and as a result a deploy from the pipeline will only add new elements, it will not overwrite existing configuration.
2.  manging completely through what is in version control.  Select `true` when launching the github actions script to `Overwrite config set by Admin UI Panel?`

Currently it only supports managing `ui_attributes` properties and `taskrouter_skills` within the [Flex UI Configuration](https://www.twilio.com/docs/flex/developer/ui/configuration).

- `ui_attributes` managed per environment
- `taskrouter_skills` managed across all environments


## To Use Locally (typically not neccessary)

_NOTE_ although not typically neccessary, these instructions are intended for completeness.  Local development should use `plugin-flex-ts-template-v2\public\appConfig.js`. For shared environments please use the github release pipeline scripts.

1. Make sure the dependent modules are installed

```bash
npm install
```

2. Create your .env file

```bash
cp .env.example .env
```

3. have a twilio api key and secret for your account
   - follow this [guide](https://www.twilio.com/docs/glossary/what-is-an-api-key#how-can-i-create-api-keys) to setup an API key if you dont have one

4. Add `TWILIO_ACCOUNT_SID` and `TWILIO_API_KEY` and `TWILIO_API_SECRET` values to the `.env` file

5. Review/Edit the `taskrouter_skills.json` and ensure the skills match the ones you want to deploy. This is used on every environment to deploy a common set of skills. Note the skills in the file will be merged with any skills existing in the environment.

6. cp the `ui_attributes.example.json` to `ui_attributes.local.json`.

```bash
cp ui_attributes.example.json ui_attributes.local.json
```

7. Run `npm run deploy:local` to update the Flex configuration.

---

## To use with release pipeline

follow the instructions for setting up the release pipeline [here](/setup-guides/deploy-to-hosted-flex)

# Configuring skills

The `taskrouter_skills.json` file defines skills that should be automatically deployed. The skills in the file will be merged with any skills existing in the environment. By default this is empty. 

*Note that its important to use skill names without spaces* 

Here is an example of how you can populate this file:

```json
[
  {
    "minimum": null,
    "multivalue": false,
    "name": "billing",
    "maximum": null
  },
  {
    "minimum": null,
    "multivalue": false,
    "name": "support",
    "maximum": null
  },
  {
    "minimum": null,
    "multivalue": false,
    "name": "offline_work",
    "maximum": null
  }
]
```
