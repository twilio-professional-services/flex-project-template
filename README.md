# twilio-proserv-flex-project-template

This repository is a template for starting new flex projects and provides

- a pattern for distributed development
- a means to configure the plugin per twilio account
- a means to couple serverlress functions with the plugin
- an example github actions for CI/CD setup

It also provides
- some common features that can be toggled on/off
- a pattern for calling serverless functions with retry handling
- a pattern for serverless functions to also handle their own retries
- utilities for common operations performed from flex (such as updating task attributes safely)
- a foundation to aggregrate future work
- a library of features and examples that can be used to demonstrate development patterns


## basic setup

1. Either fork or clone the repository
2. from **twilio-proserv-flex-project-template/serverless-functions**
  - run *npm install* 
  - copy .env.dev to .env
3. in the new .env file 
  - add **ACCOUNT_SID=<YOUR_TWILIO_ACCOUNT_SID> AUTH_TOKEN=<YOUR_TWILIO_AUTH_TOKEN>**
4. review the SIDs in the file and reference the appropriate ones from your own account.  If using callback or chat transfer, setup a taskrouter workflow for these first. For testing purposes the default "Assign to anyone" workflow can be used for callback but the chat transfer will need setup following the example in **twilio-proserv-flex-project-template/plugin-flex-ts-template/src/feature-library/chat-transfer/example-taskrouter-workflow.json** where each possible queue has its own filter with a single agent transfer filter at the top.
  > standard SIDs <br>
  > &nbsp;TWILIO_FLEX_WORKSPACE_SID=<br>
  > &nbsp;TWILIO_FLEX_SYNC_SID= <br>
  > &nbsp;TWILIO_FLEX_CHAT_SERVICE_SID= <br>
  > sids for added feature workflows <br>
  > &nbsp;TWILIO_FLEX_CALLBACK_WORKFLOW_SID= <br>
  > &nbsp;TWILIO_FLEX_CHAT_TRANSFER_WORKFLOW_SID= <br>
5. ensuring your twilio cli profile is set to the right account run: **twilio serverless:deploy**
6. Take the domain name for the given serverless deploy and it to **twilio-proserv-flex-project-template/flex-config/ui_attributes.dev.json** and decide what features to enable.
7. On your twilio account create an API key and secret
8. Create a .env file in **twilio-proserv-flex-project-template/flex-config/**
9. Add to the .env file
> TWILIO_ACCOUNT_SID=<YOUR_TWILIO_ACCOUNT_SID>  <br>
> TWILIO_API_KEY=<YOUR_API_KEY> <br>
> TWILIO_API_SECRET=<YOUR_API_SECRET> <br>
10. execute *npm install* and *npm run deploy:dev*
11. from **twilio-proserv-flex-project-template/plugin-flex-ts-template**
  - run *npm install* and *twilio flex:plugins:start*
