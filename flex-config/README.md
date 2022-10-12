# Flex Configuration Updater
This is a simple set of scripts that help deploy Flex configuration settings. Currently it only supports setting `ui_attributes` properties and `taskrouter_skills` within the [Flex UI Configuration](https://www.twilio.com/docs/flex/developer/ui/configuration).  

- `ui_attributes` managed per environment 
- `taskrouter_skills` managed across all environments

The version controlled configuration is merged with the configuration already existing in the environment.


#### Setup
1. Make sure the dependent modules are installed
```bash
npm install
```
2. Create your .env file
```bash
cp .env.example .env
```
3. Create an account API KEY on your twilio account from the [account menu in the twilio console](https://console.twilio.com/us1/account/keys-credentials/api-keys?frameUrl=%2Fconsole%2Fproject%2Fapi-keys%3Fx-target-region%3Dus1)
4. Add `TWILIO_ACCOUNT_SID` and `TWILIO_API_KEY` and `TWILIO_API_SECRET` values to the `.env` file
5. Review/Edit the `taskrouter_skills.json` and ensure the skills match the ones you want to deploy.  This is used on every environment to deploy a common set of skills.  Note the skills in the file will be merged with any skills existing in the environment.
6. Review/Edit the `ui_attributes.{env}.json` that you intend to use.  Currently only `ui_attributes.dev.json`, `ui_attributes.test.json`, `ui_attributes.qa.json`, and `ui_attributes.prod.json` are recognized but it would be easy to modify the index.js to account for other environment names.
7. Run `npm run deploy:{env}` to update the Flex configuration.  Again, only `deploy:dev`, `deploy:test`, `deploy:qa`, and `deploy:prod` are currently configured

The output will log the updated version of the Flex UI Configuration
