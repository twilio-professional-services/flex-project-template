# Flex Configuration Updater
This is a simple little tool that should help deploy Flex configuration settings. Currently it only supports setting `ui_attributes` properties and `taskrouter_skills`.

#### Setup
1. Run `npm install` inside this directory
2. Create a `.env` file in this directory
3. Create an account API KEY on your twilio account from the account menu
4. Add `TWILIO_ACCOUNT_SID` and `TWILIO_API_KEY` and `TWILIO_API_SECRET` values to the `.env` file
5. Create/Edit a single `taskrouter_skills.json` file
    - Used for every environment to deploy a common set of skills
6. Create/Edit a `{stageNameHere}.ui_attributes.json` matching file
    - Currently only `ui_attributes.dev.json`, `ui_attributes.test.json`, `ui_attributes.qa.json`, and `ui_attributes.prod.json` are recognized
7. Run `npm run deploy:{env}` to update the Flex configuration
    - Currently `deploy:dev`, `deploy:test`, `deploy:qa`, and `deploy:prod` are the only ones configured

The output should log the now updated version of the data received from Flex.
