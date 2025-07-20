---
title: Add-ons
---

When building a Twilio Flex solution, you may have additional supporting packages that need to be deployed, such as web apps or services. These can be managed and deployed with the template using the `addons` directory. Packages within this directory will be processed by [the setup script](/building/template-utilities/configuration#setup-script-reference), which populates missing environment variables and installs dependencies. Packages within this directory will also be automatically deployed using the included workflows.

## Included add-ons

The template includes a few add-on packages supporting the included features, which serves as an example of how the infrastructure is used.

### serverless-schedule-manager

This package manages the serverless functions specific to the _schedule-manager_ feature. This package is separate from the `serverless-functions` package due to the actual schedule manager configuration being part of this serverless package--the entire service is re-deployed upon each configuration publish. If you are deploying the schedule-manager feature, you will need to also deploy this package. If you are not deploying the `schedule-manager` feature, this service will not be used and does not need to be deployed.

### twilio-video-demo-app

This proof-of-concept application demonstrates how you can build a video application with [Twilio Programmable Video JS SDK](https://www.twilio.com/docs/video/javascript-getting-started), [Next JS](https://nextjs.org/), and [Twilio Paste](https://paste.twilio.design/). It is used by the included `chat-to-video-escalation` feature to provide a feature-rich video app for agents and customers. This application does not deploy itself--rather, the built application is copied to the `serverless-functions` assets and is deployed when that package is deployed.

## Package requirements

Packages (which are sub-directories of the `addons` directory) must adhere to a few basic requirements:

- Must include an npm-compatible `package.json` within its root directory
- For automatic environment variable population, an `.env.example` file must be included within its root directory, with placeholder values in the `<YOUR_ENVVARNAME>` format
- A `deploy` script defined within `package.json` for deployment
- A `postinstall` script may optionally be defined within `package.json` for steps that should occur after installation but prior to deploy

## How it works

When the environment setup script is run, packages within the `addons` directory will be processed as follows:
1. If a `.env` or `.env.<environment>` file exists, any placeholder variables will be replaced using the same logic as with other packages. If the file doesn't exist and a `.env.example` file exists, that file will first be copied to `.env` or `.env.<environment>`, depending if the script is run locally.
   1. You should [take advantage of this](/building/template-utilities/configuration#influencing-the-automatic-configuration) for environment variables that are defined within your CI (such as GitHub Actions variables and secrets) or for populating entity SIDs from your Twilio account, which differ between accounts.
2. The package's dependencies will be installed via `npm install`. If a `postinstall` script is defined, that will also be executed.

When performing a deployment, the `npm run deploy-addons` script is executed after the environment setup script. This will run `npm run deploy` from each package within the `addons` directory.