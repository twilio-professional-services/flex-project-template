# Flex Configuration Updater
This is a simple set of scripts that help deploy Flex configuration settings. Currently it only supports setting `ui_attributes` properties and `taskrouter_skills` within the [Flex UI Configuration](https://www.twilio.com/docs/flex/developer/ui/configuration).  

- `ui_attributes` managed per environment 
- `taskrouter_skills` managed across all environments

The version controlled configuration is merged with the configuration already existing in the environment.


## To Use Locally
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
5. Review/Edit the `taskrouter_skills.json` and ensure the skills match the ones you want to deploy.  This is used on every environment to deploy a common set of skills.  Note the skills in the file will be merged with any skills existing in the environment.
6. cp the `ui_attributes.example.json` to `ui_attributes.local.json`.
```bash
cp ui_attributes.example.json ui_attributes.local.json
```
7. Run `npm run deploy:local` to update the Flex configuration.

---

## To use with release pipeline

follow the instructions for setting up the release pipeline [here](/README.md#setup-a-project-with-release-pipeline);
