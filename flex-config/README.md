# Flex Configuration Updater
This is a simple little tool that should help deploy Flex configuration settings. Currently it only supports setting `ui_attributes` properties and `taskrouter_skills`.

#### Setup
1. Run `npm install` inside this directory
2. Create a `{stageNameHere}.env` file in this directory
    - Currently `dev.env`, `test.env`, `qa.env`, and `prod.env` are the only ones recognized
3. Add `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN` values to that file for the matching Twilio account
4. Create/Edit a single `taskrouter_skills.json` file
    - Used for every environment to deploy a common set of skills
4. Create/Edit a `{stageNameHere}.ui_attributes.json` matching file
    - Currently only `dev.ui_attributes.json`, `test.ui_attributes.json`, `qa.ui_attributes.json`, and `prod.ui_attributes.json` are recognized
5. Run `npm run {stageNameHere}:merge-configuration` to update the Flex configuration
    - Currently `dev:deploy-configuration`, `test:deploy-configuration`, `qa:deploy-configuration`, and `prod:deploy-configuration` are the only ones configured

The output should log the now updated version of the data received from Flex.