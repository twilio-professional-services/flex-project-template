---
sidebar_label: Overview
sidebar_position: 1
title: Okay tell me more, what does it do exactly?
---

Well the template provides a means to version control the [Flex Configuration](/how-it-works/flex-config), [the plugin code](/how-it-works/plugin-flex-ts-template-v2) itself as well as the supporting [serverless functions](/how-it-works/serverless-functions). There is also a solution to manage [task router configuration](/how-it-works/infra-as-code). The infrastructure as code is a bit more involved to setup and we are currently working on making that easier but there are guides available for the sample provided [here](https://www.twilio.com/blog/intro-to-infrastructure-as-code-with-twilio-part-1). There is also an example yaml file for building a release pipeline using github actions.

The template comes with a [library of example features](/feature-library/overview) that cover a lot of typical extensions to Flex. These features can easily be turned on or off or simply just removed by leveraging the [scripts](/how-it-works/scripts) provided. If you use the scripts to [remove all the features](/how-it-works/scripts#removing-features), you will be left with just the structure of the template plus some handy utilities and serverless functions.

You might be asking why would i want the serverless functions? Well you may be aware already, Twilio accounts have a maximum API concurrency limit of 100. Some specific APIs have their own specific rate limit and so its [best practice](https://support.twilio.com/hc/en-us/articles/360044308153-Twilio-API-response-Error-429-Too-Many-Requests-) to handle the 429 responses that can come back. The serverless functions provide an example of how to do this in the serverless and plugin layer. There are also operations in there that improve the quality of the Flex solution, for example, you can update task attributes using an [ETAG](https://www.twilio.com/docs/taskrouter/api/task#task-version) to improve transaction safety and this isnt currently available on the front end sdk.

At the root of the repository you will find the following packages

- [flex-config](/how-it-works/flex-config)
- [infra-as-code](/how-it-works/infra-as-code)
- [plugin-flex-ts-template-v2](/how-it-works/plugin-flex-ts-template-v2)
- [serverless-functions](/how-it-works/serverless-functions)
- [serverless-schedule-manager](/how-it-works/serverless-schedule-manager)
- [web-app-examples](/how-it-works/web-app-examples)
- [scripts](/how-it-works/scripts)
- [.github](/how-it-works/github)
